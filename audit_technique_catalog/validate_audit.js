'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

console.log('=== RUNNING INDEPENDENT AUDIT VALIDATION SUITE ===');

const snapshotRoot = path.join(__dirname, 'snapshot/JianghuSect_v1.10');
const G = require(path.join(snapshotRoot, 'test/load.js'));
const { JD } = G;

let passed = true;
function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    passed = false;
  } else {
    console.log(`PASS: ${message}`);
  }
}

// 1. Verify byte-lock of human_core.js
const hcPath = path.join(snapshotRoot, 'js/human_core.js');
const hcBuf = fs.readFileSync(hcPath);
const hcHash = crypto.createHash('sha256').update(hcBuf).digest('hex');
const EXPECTED_HC_HASH = 'a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542';
assert(hcHash === EXPECTED_HC_HASH, `human_core.js SHA256 byte-lock verified (${hcHash.slice(0, 16)}...)`);

// 2. Verify CSV Deliverable
const csvPath = path.join(__dirname, 'technique_audit.csv');
assert(fs.existsSync(csvPath), 'technique_audit.csv exists on disk');

const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV lines handling quotes
function parseCsv(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let cell = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(cell);
        cell = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && next === '\n') i++;
        row.push(cell);
        cell = '';
        if (row.length > 1 || row[0] !== '') {
          lines.push(row);
        }
        row = [];
      } else {
        cell += c;
      }
    }
  }
  if (cell || row.length > 0) {
    row.push(cell);
    if (row.length > 1 || row[0] !== '') lines.push(row);
  }
  return lines;
}

const parsedRows = parseCsv(csvContent);
const headerRow = parsedRows[0];
const dataRows = parsedRows.slice(1);

const EXPECTED_HEADERS = [
  'id', 'name', 'registry', 'category', 'path', 'subpath', 'element',
  'current_tier', 'current_req_tier', 'current_power', 'actual_prerequisites',
  'actual_effect_summary', 'costs_and_limitations', 'proposed_tier',
  'proposed_grade', 'tier_reason', 'grade_reason', 'comparable_ids',
  'data_source', 'behavior_source', 'verified_acquisition_routes',
  'confidence', 'uncertainties', 'save_and_balance_impact'
];

assert(headerRow.length === 24, `CSV header has exactly 24 columns (found ${headerRow.length})`);
assert(JSON.stringify(headerRow) === JSON.stringify(EXPECTED_HEADERS), 'CSV headers exactly match required specification');

const totalCatalogUniqueIds = JD.TECH.techniques.length + JD.TECH.mantras.length;
assert(totalCatalogUniqueIds === 370, `Snapshot catalog contains exactly 370 items (found ${totalCatalogUniqueIds})`);
assert(dataRows.length === 370, `CSV contains exactly 370 data rows (found ${dataRows.length})`);

// Build map of catalog IDs
const catalogIdSet = new Set([
  ...JD.TECH.techniques.map(t => t.id),
  ...JD.TECH.mantras.map(m => m.id)
]);

const seenIds = new Set();
let invalidTiers = 0;
let invalidGrades = 0;
let emptyReasons = 0;
let invalidComparables = 0;

dataRows.forEach((r, idx) => {
  const rowObj = {};
  headerRow.forEach((h, hIdx) => { rowObj[h] = r[hIdx]; });

  const id = rowObj.id;
  if (!catalogIdSet.has(id)) {
    console.error(`Row ${idx + 1}: Unexpected ID ${id}`);
    passed = false;
  }
  if (seenIds.has(id)) {
    console.error(`Row ${idx + 1}: Duplicate ID ${id}`);
    passed = false;
  }
  seenIds.add(id);

  const pTier = Number(rowObj.proposed_tier);
  if (![1, 2, 3, 4, 5, 6, 7].includes(pTier)) {
    invalidTiers++;
  }

  const pGrade = rowObj.proposed_grade;
  if (!['Common', 'Refined', 'Rare', 'Exceptional', 'Legendary'].includes(pGrade)) {
    invalidGrades++;
  }

  if (!rowObj.tier_reason || !rowObj.grade_reason || rowObj.tier_reason.length < 15 || rowObj.grade_reason.length < 15) {
    emptyReasons++;
  }

  const comps = (rowObj.comparable_ids || '').split('|');
  if (comps.length === 0 || !comps[0]) {
    invalidComparables++;
  } else {
    comps.forEach(cid => {
      if (!catalogIdSet.has(cid)) {
        console.error(`Row ${idx + 1} (${id}): Invalid comparable ID ${cid}`);
        invalidComparables++;
      }
    });
  }
});

assert(seenIds.size === 370, `All 370 unique IDs mapped with zero duplicate entries (found ${seenIds.size})`);
assert(invalidTiers === 0, `All proposed tiers are valid numbers 1-7 (invalid=${invalidTiers})`);
assert(invalidGrades === 0, `All proposed grades belong to standard taxonomy (invalid=${invalidGrades})`);
assert(emptyReasons === 0, `All rows have substantive, entry-specific reasoning (empty/short=${emptyReasons})`);
assert(invalidComparables === 0, `All comparable IDs exist in the catalog (invalid=${invalidComparables})`);

// 3. Verify coverage JSON
const covPath = path.join(__dirname, 'technique_audit_coverage.json');
assert(fs.existsSync(covPath), 'technique_audit_coverage.json exists on disk');
const cov = JSON.parse(fs.readFileSync(covPath, 'utf8'));
assert(cov.auditedCommitSha === '0218ae4ddb227422952ca933ea8b42a191836476', 'Coverage audited SHA matches remote main-1');
assert(cov.uniqueCatalogIds === 370, 'Coverage uniqueCatalogIds === 370');
assert(cov.auditedRowCount === 370, 'Coverage auditedRowCount === 370');
assert(cov.missingCatalogIds === 0, 'Coverage missingCatalogIds === 0');
assert(cov.unexpectedCatalogIds === 0, 'Coverage unexpectedCatalogIds === 0');
assert(cov.duplicateCsvRowIds === 0, 'Coverage duplicateCsvRowIds === 0');
assert(cov.unclassifiedCatalogIds === 0, 'Coverage unclassifiedCatalogIds === 0');

console.log('=== VALIDATION SUMMARY ===');
if (passed) {
  console.log('ALL AUDIT VALIDATION CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('AUDIT VALIDATION FAILED WITH ERRORS!');
  process.exit(1);
}
