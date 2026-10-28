'use strict';
// Exercise the real HUD speed-button handler without launching the full simulation.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const perf = fs.readFileSync(path.join(__dirname, 'perf.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');

const elements = Object.create(null);
function makeElement(id) {
  const el = {
    id, onclick: null, innerHTML: '', style: {}, dataset: {},
    addEventListener() {}, classList: { add() {}, remove() {}, toggle() {} },
    querySelectorAll() { return []; }
  };
  if (id === 'speedBar') {
    let html = '';
    Object.defineProperty(el, 'innerHTML', {
      get() { return html; },
      set(value) {
        html = value;
        el.buttons = [...value.matchAll(/<button[^>]*data-sp="(\d+)"[^>]*>(.*?)<\/button>/g)]
          .map(m => ({ dataset: { sp: m[1] }, textContent: m[2], closest() { return this; } }));
      }
    });
  }
  return el;
}
const document = {
  getElementById(id) { return elements[id] || (elements[id] = makeElement(id)); },
  querySelectorAll() { return []; },
  createElement() { return makeElement('created'); },
  body: { appendChild() {} }
};
const context = {
  document, console, setTimeout() {},
  U: { clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }, pad2(v) { return String(v).padStart(2, '0'); }, fmtNum(v) { return String(v); } },
  HC: {}, CULT: {}, SECT: {}, ECO: {}, AI: {}, MAP: {}, SIM: {}, EXPED: {}, JD: {}, Render: {}
};
vm.createContext(context);
vm.runInContext(source, context, { filename: 'js/ui.js' });
const UI = context.UI;
let hudUpdates = 0;
UI.G = { speed: 1 };
UI.updateHud = () => { hudUpdates++; };
UI.buildHud();
const speedBar = document.getElementById('speedBar');
const speeds = speedBar.buttons.map(b => +b.dataset.sp);
assert.deepStrictEqual(speeds, [0, 1, 2, 4, 8, 16, 32, 48]);
for (const expected of [16, 32]) {
  const button = speedBar.buttons.find(b => +b.dataset.sp === expected);
  assert(button, `missing ${expected}× button`);
  speedBar.onclick({ target: { closest: () => button } });
  assert.strictEqual(UI.G.speed, expected, `clicking ${expected}× should set G.speed`);
}
assert.strictEqual(hudUpdates, 2, 'speed changes should refresh the HUD');
assert.match(perf, /\[1, 4, 16, 32, 48\]/, 'performance test should include 32×');
assert.match(css, /@media\(max-width:699px\)[\s\S]*#speedBar button\{flex:1 1 0;min-width:0/, 'mobile speed controls should fit one row');
console.log('PASS speed button list: ' + speeds.join('×, ') + '×');
console.log('PASS clicking 16× and 32× changes G.speed and refreshes the HUD');
console.log('PASS mobile speed-button layout rule and 32× performance test coverage');
console.log('NOTE: full simulation throughput still needs a browser/device benchmark');
