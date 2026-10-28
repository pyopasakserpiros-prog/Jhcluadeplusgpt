'use strict';
const assert=require('assert'),fs=require('fs'),{SIM,ECO,AI}=require('./load');
const raw=JSON.parse(fs.readFileSync(__dirname+'/fixtures/v1_9_synthetic.json','utf8'));
const W=SIM.deserialize(JSON.stringify(raw));
assert.strictEqual(W.season,1);assert.strictEqual(W.t,raw.t);assert.deepStrictEqual(W.rng.getState(),raw.rng);assert.deepStrictEqual(W.sect.stock,raw.sect.stock);assert.deepStrictEqual(W.sect.library,raw.sect.library);
for(const saved of raw.npcs) {const n=W.byId[saved.id];assert(n);assert.deepStrictEqual(n.h,saved.h);assert.deepStrictEqual(n.inv,saved.inv);assert.deepStrictEqual(n.cult,saved.cult);assert.strictEqual(n.cp,saved.cp);}
const n=W.npcs[1],ctx=n.act.ctx;assert(ctx.craftReceipt,'paid old action adopted');
const before=JSON.stringify(W.sect.stock);SIM.deserialize(SIM.serialize(W));assert.strictEqual(JSON.stringify(W.sect.stock),before);
AI.ACTS.brewBasic.done(n,W,ctx);const result=SIM.serialize(W);AI.ACTS.brewBasic.done(n,W,ctx);assert(SIM.serialize(W)===result,'legacy paid action settles only once');
console.log('PASS actual v1.9 synthetic save: identities, progression, inventory, CP, library, RNG, season and paid craft resume');
