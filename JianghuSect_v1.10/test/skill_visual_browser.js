'use strict';
const assert=require('assert'),path=require('path');
const { chromium } = (() => { try { return require('playwright'); } catch (_) { return require('../tools/cdp_playwright.js'); } })();
(async()=>{const browser=await chromium.launch();try{
 const c=await browser.newContext({viewport:{width:412,height:860},isMobile:true,hasTouch:true});const page=await c.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve(__dirname,'../index.html'));await page.click('[data-pick="0"]');
 const r=await page.evaluate(()=>{
  G.speed=0;const R=G.R,W=G.W,rngBefore=JSON.stringify(G.W.rng.getState());R.setWorld(W);R.updateCastEffects(1000);
  const n=W.npcs[0];R.alpha=1;R.focus(n.x,n.y,2);n.castFx={t:W.t,seq:1,kind:'normal',x:n.x+1,y:n.y};R.updateCastEffects(1016);
  const normal=[...R.castActive.values()][0];const firstSize=R.castActive.size,clock=R.castClock;
  R.updateCastEffects(5016);const paused=R.castClock===clock&&R.castActive.size===firstSize;
  n.castFx={t:W.t,seq:2,kind:'forbidden',x:n.x+1,y:n.y};R.updateCastEffects(5032);const forbidden=[...R.castActive.values()].find(x=>x.kind==='forbidden');
  G.speed=1;for(let t=5048;t<=7048;t+=16)R.updateCastEffects(t);const expired=R.castActive.size===0;
  R.updateCastEffects(7064);const replay=R.castActive.size;
  for(const [i,u] of W.npcs.entries())u.castFx={t:W.t,seq:100+i,kind:'normal',x:u.x,y:u.y};
  const old=W.foes;W.foes=Array.from({length:50},(_,i)=>({id:'fx-cap-'+i,x:n.x,y:n.y,castFx:{t:W.t,seq:1,kind:'normal',x:n.x,y:n.y}}));R.updateCastEffects(7080);const cap=R.castActive.size;W.foes=old;R.updateCastEffects(7090);const pruned=![...R.castSeen.keys()].some(k=>k.startsWith('foe:fx-cap-'));
  R.setWorld(W);R.updateCastEffects(7100);const loadReplay=R.castActive.size;G.speed=0;
  return {normal:normal?.kind,normalLife:normal?.life,forbidden:forbidden?.kind,forbiddenLife:forbidden?.life,paused,expired,replay,cap,loadReplay,pruned,rngPreserved:rngBefore===JSON.stringify(W.rng.getState())};
 });
 assert(r.pruned,'despawned actor cache is pruned');assert(r.rngPreserved,'drawing must not consume game RNG');assert.equal(r.normal,'normal');assert.equal(r.forbidden,'forbidden');assert(r.forbiddenLife>r.normalLife);assert(r.paused,'pause freezes visual animation');assert(r.expired,'effects expire');assert.equal(r.replay,0,'old cast must not replay');assert(r.cap>0&&r.cap<=24,'visual queue bounded at24');assert.equal(r.loadReplay,0,'loaded events must not replay');assert.deepStrictEqual(errors,[]);console.log('PASS browser skill visuals: two shared styles, pause, expiry, no replay, load baseline and 24-effect cap');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
