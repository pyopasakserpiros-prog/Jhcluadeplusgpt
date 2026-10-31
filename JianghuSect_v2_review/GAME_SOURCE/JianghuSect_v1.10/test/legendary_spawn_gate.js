'use strict';
const assert=require('assert'),{SIM,WILD}=require('./load');
const W=SIM.create('legendary-common-gate');W.wildlife={seq:0,beasts:[],kills:0};
// Exercise ordinary northern refill while the rare-event roll fails.
W.rng.weighted=xs=>xs.find(x=>x.legendary)||xs[0];W.rng.chance=()=>false;
for(let i=0;i<10;i++){W.t+=60;WILD.tick(W);}
assert.equal(W.wildlife.beasts.filter(b=>b.legendary).length,0,'ordinary zone refill must not bypass legendary rarity');
assert.equal(WILD.spawn(W,'north_peak','north_sovereign_pool',{ordinary:true}),null,'an explicitly selected legendary pool cannot be used for ordinary refill');
W.rng.weighted=xs=>xs[0];
const rare=WILD.spawn(W,'north_peak',null,{legendary:true});assert(rare?.legendary);assert.equal(rare.pool,'north_sovereign_pool','rare spawn uses the matching legendary pool');rare.gone=true;
const a=WILD.spawn(W,'legend');assert(a&&a.legendary,'explicit rare encounter creates a legend');
assert.equal(WILD.spawn(W,'north_peak','north_sovereign_pool'),null,'all legendary pools share active population gate');
console.log('PASS legendary shared rarity gate across all zones');
