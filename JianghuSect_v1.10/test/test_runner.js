'use strict';
// A failed spawn can report status 0 on this platform; it must never count as a passing test.
const assert = require('assert'), fs = require('fs'), path = require('path'), vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, 'run_all.js'), 'utf8');
for (const outcome of [
  { status: 0, error: Object.assign(new Error('spawn denied'), { code: 'EPERM' }), stdout: '', stderr: '' },
  { status: null, error: Object.assign(new Error('timed out'), { code: 'ETIMEDOUT' }), stdout: '', stderr: '' },
  { status: 1, stdout: '', stderr: 'assertion failed' },
  { status: 0, stdout: 'PASS fixture', stderr: '' }
]) {
  let report;
  const context = {
    __dirname,
    require(name) {
      if (name === 'child_process') return { spawnSync: () => outcome };
      if (name === 'path') return path;
      if (name === 'fs') return {
        readdirSync: () => ['fixture.js'], mkdirSync() {},
        writeFileSync(file, contents) { report = JSON.parse(contents); }
      };
      throw new Error('Unexpected dependency: ' + name);
    },
    console: { log() {} }, process: { execPath: process.execPath, version: process.version }, Date
  };
  vm.runInNewContext(source, context, { filename: 'test/run_all.js' });
  const shouldPass = !outcome.error && outcome.status === 0;
  assert.strictEqual(context.process.exitCode || 0, shouldPass ? 0 : 1, 'runner must fail when spawn or assertions fail');
  assert(report.results.length > 1);
  assert(report.results.every(r => r.status === (shouldPass ? 'PASS' : 'FAIL')));
  if (outcome.error) {
    assert(report.results[0].output.includes(outcome.error.code), 'report must explain the spawn error');
    assert(report.results.at(-1).failures.every(r => r.error.includes(outcome.error.code)), 'syntax spawn failures must be reported');
  }
}
console.log('PASS test runner: denied spawn, timeout, assertion failure, and successful child process');
