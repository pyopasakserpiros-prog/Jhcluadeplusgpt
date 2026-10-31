#!/usr/bin/env node
'use strict';
// Measure actual HC.generate calls in a deterministic native world simulation.
// Set GENERATION_AUDIT_BY_SOURCE=1 only when caller attribution is needed; stack
// capture is intentionally opt-in because it materially slows long simulations.
const G = require('../test/load');
const { SIM, HC } = G;
const days = Math.max(1, Math.min(360, Number(process.argv[2]) || 90));
const seed = String(process.argv[3] || 'generation-audit');
const bySourceEnabled = process.env.GENERATION_AUDIT_BY_SOURCE === '1';
const totalBySource = Object.create(null);
let totalGenerated = 0;
const originalGenerate = HC.generate;
HC.generate = function () {
  totalGenerated++;
  if (bySourceEnabled) {
    const stack = new Error().stack || '';
    const lines = stack.split('\n').slice(2);
    const sourceLine = lines.find(line => /\/js\/[a-z0-9_]+\.js:\d+:\d+/i.test(line)) || 'unknown';
    const source = (sourceLine.match(/\/js\/([a-z0-9_]+\.js):(\d+):(\d+)/i) || [])[1] || 'unknown';
    totalBySource[source] = (totalBySource[source] || 0) + 1;
  }
  return originalGenerate.apply(this, arguments);
};
const W = SIM.create(seed);
const setupTotal = totalGenerated;
const setupBySource = {...totalBySource};
const startT = W.t;
const endT = startT + days*1440;
while (W.t < endT) SIM.tick(W);
const postSetup = totalGenerated - setupTotal;
const bySource = {};
if (bySourceEnabled) {
  for (const [key, value] of Object.entries(totalBySource)) {
    const later = value - (setupBySource[key] || 0);
    if (later) bySource[key] = { count: later, per360DayYear: +(later/(days/360)).toFixed(2) };
  }
}
console.log(JSON.stringify({
  seed, days, worldYearDays:360, setupGenerations:setupTotal,
  postSetupGenerations:postSetup,
  per360DayYear:+(postSetup/(days/360)).toFixed(2),
  ...(bySourceEnabled ? {bySource} : {}),
  livingMembers:W.npcs.filter(n=>!n.dead).length,
  activeVisitors:(W.world.visitors||[]).length
},null,2));
