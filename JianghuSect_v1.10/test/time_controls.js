'use strict';
const fs = require('fs');
const assert = require('assert');
const ui = fs.readFileSync(__dirname + '/../js/ui.js', 'utf8');
const main = fs.readFileSync(__dirname + '/../js/main.js', 'utf8');
const css = fs.readFileSync(__dirname + '/../css/style.css', 'utf8');

assert(/\[16, '16×'/.test(ui), '16× speed control must remain available');
assert(/\[32, '32×'/.test(ui), '32× speed control must be available');
assert(/\[48, '48×'/.test(ui), 'existing 48× fast-forward control must remain available');
assert(/title=.*s\[0\] === 0/.test(ui) && /aria-label=.*เร่งเวลา /.test(ui), 'speed controls need accessible descriptions');
assert(/SIM_BUDGET_MS = 12/.test(main), 'simulation must have a per-frame work budget');
assert(/while \(G\.acc >= 1\)/.test(main), 'pending simulation ticks must be drained from the accumulator');
assert(/SIM\.tick\(G\.W\); G\.acc -= 1/.test(main), 'subtract time only after a simulation tick runs');
assert(/G\.speed >= 32 \? 1000 \/ 30/.test(main), '32× must throttle drawing to about 30 FPS');
assert(/@media\(max-width:520px\)/.test(css) && /#speedBar button\{flex:1 1 0;min-width:0/.test(css), 'speed controls must fit a mobile viewport');
console.log('PASS time controls: 16×, 32×, 48× retained; pending ticks preserved; high-speed rendering throttled; mobile layout responsive');
