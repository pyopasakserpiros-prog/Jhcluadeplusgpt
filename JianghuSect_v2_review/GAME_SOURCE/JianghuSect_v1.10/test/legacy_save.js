'use strict';
const assert=require('assert'),fs=require('fs'),{SIM,ECO,AI,ELEM}=require('./load');
const raw=JSON.parse(fs.readFileSync(__dirname+'/fixtures/v1_9_synthetic.json','utf8'));
const W=SIM.deserialize(JSON.stringify(raw));
assert.strictEqual(W.season,1);assert.strictEqual(W.t,raw.t);assert.deepStrictEqual(W.rng.getState(),raw.rng);assert.deepStrictEqual(W.sect.stock,raw.sect.stock);assert.deepStrictEqual(W.sect.library,raw.sect.library);
for(const saved of raw.npcs) {
  const n=W.byId[saved.id];assert(n);
  // New v2 elemental root schema is enforced on deserialization
  assert.strictEqual(n.h.root.schemaVersion, 2);
  assert(n.h.root.rootCount >= 1 && n.h.root.rootCount <= 4);
  assert.strictEqual(n.h.root.elements.length, n.h.root.rootCount);
  assert.strictEqual(n.h.root.grades.length, n.h.root.rootCount);
  assert(n.ext && n.ext.elementalSystem && n.ext.elementalSystem.version === 2);
  assert.deepStrictEqual(n.inv,Object.assign({crystals:{},subManuals:[]},saved.inv));
  assert.deepStrictEqual(n.cult,saved.cult);
  assert.strictEqual(n.cp,saved.cp);
}
const n=W.npcs[1],ctx=n.act.ctx;assert(ctx.craftReceipt,'paid old action adopted');
const before=JSON.stringify(W.sect.stock);
const roundTrip=SIM.deserialize(SIM.serialize(W));
assert.strictEqual(JSON.stringify(roundTrip.sect.stock),before);
for(const npc of W.npcs) {
  assert.deepStrictEqual(roundTrip.byId[npc.id].h, npc.h);
  assert.deepStrictEqual(roundTrip.byId[npc.id].ext.elementalSystem, npc.ext.elementalSystem);
}
AI.ACTS.brewBasic.done(n,W,ctx);const result=SIM.serialize(W);AI.ACTS.brewBasic.done(n,W,ctx);assert(SIM.serialize(W)===result,'paid action settles only once');
console.log('PASS v2 save schema & synthetic save: v2 roots/mastery, identities, progression, inventory, CP, library, RNG, season and paid craft resume');
