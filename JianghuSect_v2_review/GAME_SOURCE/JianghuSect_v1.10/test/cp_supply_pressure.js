'use strict';
const assert=require('assert');const {SIM,CPE,ECO}=require('./load');
const W=SIM.create('supply-reward'),id='MAT_HERB_DEW_GRASS_1',target=CPE.target(W,id);
W.sect.stock[id]=0;const scarce=CPE.reward(W,id,1);W.sect.stock[id]=target*10;const oversupply=CPE.reward(W,id,1);W.sect.stock[id]=target*20;const extreme=CPE.reward(W,id,1);
assert(scarce>oversupply && oversupply>extreme,'further excess stock reduces reward rather than retaining 20% floor');
assert(extreme>0,'work still earns a positive contribution reward');
assert(CPE.priceOf(W,id)>extreme,'shop price stays above donation reward');
console.log('PASS contribution rewards respond to extreme oversupply and stay positive without shop arbitrage');
