'use strict';
const assert = require('assert');
const { SIM, EXPED: X, JD, ECO } = require('./load');
// A legitimate random choice must never put a regional source beast in a sect raid.
const W = SIM.create('raid-regional-species'), imported = new Set(JD.EXPANSION.beasts.map(b => b.id));
const originalPick = W.rng.pick.bind(W.rng);
W.rng.pick = list => list.find(x => x && imported.has(x.id)) || originalPick(list);
const raid = X.spawnRaid(W, 'beast', 1);
assert(raid.foes.length > 0, 'native beast raid still spawns');
const foes = raid.foes.map(id => W.foeById[id]);
assert(foes.every(f => !imported.has(f.sp)), 'sect raids must exclude regional source species');
const siteBefore = JSON.stringify(W.world.contentSites);
foes.forEach(f => { f.dead = true; });
X.raidEnd(W, raid, 'A', [], []);
assert(JD.EXPANSION.materials.every(m => ECO.count(W, m.id) === 0), 'sect raids cannot grant regional materials');
assert.strictEqual(JSON.stringify(W.world.contentSites), siteBefore, 'native raids do not consume regional stocks');
console.log('PASS regional beasts stay in their habitats; native sect raids cannot create rare parts');
