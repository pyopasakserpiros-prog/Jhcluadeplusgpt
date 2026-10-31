#!/usr/bin/env node
'use strict';

// Bounded parallel equivalent of test/run_all.js for constrained agent runtimes.
// Two workers balance throughput with browser-test stability in constrained runtimes
// while preserving the exact suite list and adding a full JavaScript syntax sweep.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const runnerSource = fs.readFileSync(path.join(root, 'test/run_all.js'), 'utf8');
const match = runnerSource.match(/const tests=\[(.*?)\];/s);
if (!match) throw new Error('Could not read suite list from test/run_all.js');
const tests = [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
const maxWorkers = Math.max(1, Math.min(6, Number(process.env.TEST_WORKERS) || 2));
const perTestTimeoutMs = Math.max(10000, Number(process.env.TEST_TIMEOUT_MS) || 110000);
const results = new Array(tests.length);
let nextIndex = 0;

function runOne(name) {
  return new Promise(resolve => {
    const started = Date.now();
    let stdout = '', stderr = '', settled = false;
    const child = spawn(process.execPath, [path.join(root, 'test', name + '.js')], { cwd: root });
    const timer = setTimeout(() => {
      if (settled) return;
      child.kill('SIGKILL');
      finish({ test: name, status: 'TIMEOUT', exitCode: null, durationSec: (Date.now() - started) / 1000, output: (stdout + stderr).slice(-8000) });
    }, perTestTimeoutMs);
    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', error => finish({ test: name, status: 'FAIL', exitCode: null, durationSec: (Date.now() - started) / 1000, output: (stdout + stderr + '\n' + error.stack).slice(-8000) }));
    child.on('close', code => finish({ test: name, status: code === 0 ? 'PASS' : 'FAIL', exitCode: code, durationSec: (Date.now() - started) / 1000, output: (stdout + stderr).slice(-8000) }));
    function finish(row) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(row);
    }
  });
}

async function worker() {
  while (true) {
    const index = nextIndex++;
    if (index >= tests.length) return;
    results[index] = await runOne(tests[index]);
    process.stdout.write(`${results[index].status} ${results[index].test} (${results[index].durationSec.toFixed(2)}s)\n`);
  }
}

function checkSyntax(file) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, ['--check', file], { cwd: root });
    let stderr = '';
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', error => resolve({ file: path.relative(root, file), ok: false, error: error.message }));
    child.on('close', code => resolve({ file: path.relative(root, file), ok: code === 0, error: code === 0 ? '' : stderr }));
  });
}

(async () => {
  const started = Date.now();
  await Promise.all(Array.from({ length: maxWorkers }, () => worker()));
  const jsFiles = ['data', 'js', 'tools', 'test'].flatMap(dir =>
    fs.readdirSync(path.join(root, dir)).filter(name => name.endsWith('.js')).map(name => path.join(root, dir, name))
  );
  const syntax = await Promise.all(jsFiles.map(checkSyntax));
  const syntaxResult = {
    test: 'syntax_check_all_js',
    status: syntax.every(row => row.ok) ? 'PASS' : 'FAIL',
    files: syntax.length,
    failures: syntax.filter(row => !row.ok)
  };
  const allResults = results.concat([syntaxResult]);
  const summary = {
    total: allResults.length,
    pass: allResults.filter(row => row.status === 'PASS').length,
    fail: allResults.filter(row => row.status === 'FAIL').length,
    timeout: allResults.filter(row => row.status === 'TIMEOUT').length
  };
  const report = {
    date: new Date().toISOString(),
    node: process.version,
    mode: 'parallel regression audit',
    maxWorkers,
    perTestTimeoutMs,
    durationSec: (Date.now() - started) / 1000,
    summary,
    results: allResults
  };
  const resultDir = path.join(root, 'test/results');
  fs.mkdirSync(resultDir, { recursive: true });
  fs.writeFileSync(path.join(resultDir, 'parallel_audit_latest.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(resultDir, 'assertions.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(`SUMMARY ${JSON.stringify(summary)} duration=${report.durationSec.toFixed(2)}s syntaxFiles=${syntax.length}\n`);
  if (summary.fail || summary.timeout) process.exitCode = 1;
})().catch(error => {
  process.stderr.write((error && error.stack) || String(error));
  process.exitCode = 1;
});
