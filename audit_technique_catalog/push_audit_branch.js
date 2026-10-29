'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const auditDir = __dirname;

console.log('=== PREPARING AUDIT ARTIFACTS AND PUSHING TO BRANCH GEMINI / GENINI ===');

// 1. Remove temporary snapshot directory to avoid duplicating repository history
const snapshotDir = path.join(auditDir, 'snapshot');
if (fs.existsSync(snapshotDir)) {
  console.log('Removing snapshot directory...');
  fs.rmSync(snapshotDir, { recursive: true, force: true });
  console.log('Removed snapshot directory.');
}

// 2. Remove temporary scratch helper scripts
const scratchFiles = [
  'check_branches.js',
  'check_cats.js',
  'check_csv_samples.js',
  'check_env.js',
  'check_git_status.js',
  'check_origin_log.js',
  'extract_catalog.js',
  'extract_snapshot.js',
  'find_learning.js',
  'inspect_combat.js',
  'inspect_cult_learn.js',
  'inspect_entries_deep.js',
  'inspect_know_js.js',
  'inspect_martial_js.js',
  'inspect_mechanics.js',
  'inspect_remote.js',
  'inspect_skills.js',
  'list_audit_dir.js',
  'read_combat_skills.js',
  'read_know_detail.js',
  'read_know_discover.js',
  'read_martial_detail.js',
  'read_profile_detail.js',
  'read_skills_detail.js',
  'sample_techs.js',
  'test_catalog_builder.js',
  'test_push_auth.js',
  'verify_repo_clean.js'
];

scratchFiles.forEach(f => {
  const p = path.join(auditDir, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
  }
});
console.log('Cleaned scratch scripts.');

// 3. Verify core deliverables exist before commit
const requiredDeliverables = [
  'technique_audit.csv',
  'technique_audit_summary.md',
  'technique_audit_review_queue.md',
  'technique_audit_coverage.json',
  'validate_audit.js',
  'generate_audit_dataset.js',
  'map_acquisition_routes.js',
  'trace_catalog_sources.js',
  'extract_raw_entries.js',
  'SNAPSHOT_METADATA.json',
  'CATALOG_SOURCES_BREAKDOWN.json',
  'ACQUISITION_MAP.json',
  'raw_catalog_entries.json'
];

requiredDeliverables.forEach(f => {
  const p = path.join(auditDir, f);
  if (!fs.existsSync(p)) {
    throw new Error(`Required deliverable missing: ${f}`);
  }
  const size = fs.statSync(p).size;
  console.log(`Verified ${f} (${size} bytes)`);
});

// 4. Git Operations
function runGit(cmd) {
  console.log(`> git ${cmd}`);
  const out = execSync(`git ${cmd}`, { cwd: repoRoot, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  console.log(out.trim());
  return out;
}

try {
  // Checkout branch gemini based on origin/main-1
  runGit('checkout -B gemini origin/main-1');

  // Stage only audit_technique_catalog/
  runGit('add audit_technique_catalog/');

  // Check git status
  runGit('status --short');

  // Commit
  runGit('commit -m "docs(audit): complete 370-item technique & manual catalog audit (v1.10.9)\n\n- technique_audit.csv: complete 370-entry classification across 24 columns\n- technique_audit_summary.md: full methodology, counts, rubrics, distributions\n- technique_audit_review_queue.md: prioritized review queue for Codex\n- technique_audit_coverage.json: zero-gap verification manifest\n- validate_audit.js: automated verification test suite\n- baseline commit: 0218ae4ddb227422952ca933ea8b42a191836476"');

  // Push to branch gemini
  console.log('Pushing to origin/gemini...');
  runGit('push -u origin gemini');

  // Also push to branch genini as alias
  console.log('Pushing to origin/genini...');
  runGit('push origin gemini:genini');

  console.log('=== PUSH COMPLETED SUCCESSFULLY ===');
} catch (err) {
  console.error('Git operation failed:');
  console.error(err.stdout || '');
  console.error(err.stderr || '');
  console.error(err.message);
  process.exit(1);
}
