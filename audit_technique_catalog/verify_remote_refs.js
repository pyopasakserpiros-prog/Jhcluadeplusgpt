'use strict';
const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join(__dirname, '..');

console.log('=== VERIFYING PUSHED COMMIT SHA ===');
console.log(execSync('git log -n 1 --stat', { cwd, encoding: 'utf8' }));
console.log(execSync('git ls-remote origin gemini genini', { cwd, encoding: 'utf8' }));
