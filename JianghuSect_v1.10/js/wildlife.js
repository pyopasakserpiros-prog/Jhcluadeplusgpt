/* สัตว์อสูรบนแผนที่เดียวกับสำนัก แยกจากคณะเดินทางนอกสำนัก */
(function(g){
 'use strict';
 const {U,MAP,AI,CULT,COMBAT,JD,HC,ECO}=g;
 const WILD={};
 const zones={meadow:{x0:38,x1:96,y0:139,y1:153,min:1,max:2},ridge:{x0:140,x1:202,y0:139,y1:153,min:3,max:5},legend:{x0:140,x1:202,y0:139,y1:153,min:6,max:7}};
 WILD.zones=zones;
 WILD.init=W=>{if(!W.wildlife)W.wildlife={seq:0,beasts:[],kills:0};};
 WILD.spawn=(W,zoneId)=>{
  WILD.init(W);const z=zones[zoneId];if(!z)return null;
  const pool=JD.BEASTS.species.filter(s=>s.tier>=z.min&&s.tier<=z.max&&Array.isArray(s.drops)&&s.drops.some(id=>ECO.matById[id]));if(!pool.length)return null;
  const species=W.rng.pick(pool),x=W.rng.int(z.x0,z.x1),y=W.rng.int(z.y0,z.y1),id='wild_'+(++W.wildlife.seq);
  const b={id,foe:true,wild:true,speciesId:species.id,name:species.nameTh,tier:species.tier,power:species.cp,hpMax:Math.round(species.cp*1.3+30),x:x+.5,y:y+.5,px:x+.5,py:y+.5,zone:zoneId,speed:.5,face:1,aggressive:zoneId!=='meadow'&&species.aggro>=70,legendary:zoneId==='legend',expires:zoneId==='legend'?W.t+W.rng.int(3,10)*1440:null,dead:false,gone:false,skl:[]};b.hp=b.hpMax;W.wildlife.beasts.push(b);
  if(b.legendary)W.log('explore','★ '+b.name+' ปรากฏตัวนอกสำนัก และอาจจากไปเมื่อใดก็ได้',[]);
  return b;
 };
 WILD.startFight=(W,n,b)=>{
  if(!n||n.dead||n.away||n.travel||!b||b.dead||b.gone||b.fighting||n.act.id==='fight')return false;
  if(n.y<=W.map.wall.y1||b.y<=W.map.wall.y1||Math.hypot(n.x-b.x,n.y-b.y)>3)return false;
  W.foes.push(b);W.foeById[b.id]=b;
  const f=COMBAT.startFight(W,[n.id],[b.id],'wild',{serious:true,ctx:{beastId:b.id,hunterId:n.id}});b.fighting=f.id;
  W.log('combat',n.h.name.given+' เผชิญ '+b.name+' นอกสำนัก',[n.id]);return true;
 };
 WILD.finish=(W,f,winner)=>{
  if(!f||f.wildSettled)return;f.wildSettled=true;
  const b=W.foeById[f.ctx.beastId],n=W.byId[f.ctx.hunterId];if(!b)return;
  if(b.dead&&winner==='A'&&n&&!n.dead){
   const species=JD.BEASTS.species.find(s=>s.id===b.speciesId);n.inv.mats=n.inv.mats||{};
   const drops=species?species.drops.filter(id=>ECO.matById[id]):[];
   if(drops.length){const id=W.rng.pick(drops);n.inv.mats[id]=(n.inv.mats[id]||0)+1;W.log('combat',n.h.name.given+' ล่า '+b.name+' ได้ '+ECO.name(id),[n.id]);}
   if (species && g.CONTENT && g.CONTENT.organByBeastId[species.id]) {
    const out = {}; const result = g.CONTENT.harvestOrgan(W,{kind:'hunt',journal:[]},[n],out,null,species);
    if (result.recovered && out.organs) { n.inv.organs=n.inv.organs||{}; for (const [id,q] of Object.entries(out.organs)) n.inv.organs[id]=(n.inv.organs[id]||0)+q; W.log('combat',n.h.name.given+' ชำแหละได้ '+result.nameTh,[n.id]); }
   }
   W.wildlife.kills++;
  }
  W.foes=W.foes.filter(x=>x.id!==b.id);delete W.foeById[b.id];b.fighting=null;
  if(b.dead){b.gone=true;}else{b.fled=false;b.yield=false;b.act=null;}
 };
 WILD.clampCombat=W=>{ for(const b of W.wildlife?.beasts||[])if(b.fighting){const z=zones[b.zone];b.x=U.clamp(b.x,z.x0,z.x1);b.y=U.clamp(b.y,z.y0,z.y1);} };
 WILD.tick=W=>{
  WILD.init(W);const state=W.wildlife;
  if(W.t%60===0){for(const zone of ['meadow','ridge'])if(state.beasts.filter(b=>b.zone===zone&&!b.gone).length<3)WILD.spawn(W,zone);if(!state.beasts.some(b=>b.legendary&&!b.gone)&&W.rng.chance(.002))WILD.spawn(W,'legend');}
  for(const b of state.beasts){
   if(b.gone||b.dead)continue;
   if(b.fighting){const f=W.fights.find(x=>x.id===b.fighting&&!x.over);if(f){b.y=Math.max(W.map.wall.y1+1.5,b.y);continue;}b.fighting=null;}
   if(b.legendary&&W.t>=b.expires){b.gone=true;W.log('explore',b.name+' จากพื้นที่นอกสำนักไปแล้ว',[]);continue;}
   if(b.aggressive&&W.t%15===0){const n=W.npcs.find(n=>!n.dead&&!n.away&&!n.hidden&&!n.travel&&n.y>W.map.wall.y1+1&&n.act.id!=='fight'&&Math.hypot(n.x-b.x,n.y-b.y)<2);if(n)WILD.startFight(W,n,b);}
   if(!b.fighting&&W.t%90===0){const z=zones[b.zone];b.px=b.x;b.py=b.y;b.x=U.clamp(b.x+W.rng.int(-2,2),z.x0,z.x1);b.y=U.clamp(b.y+W.rng.int(-1,1),z.y0,z.y1);}
  }
  state.beasts=state.beasts.filter(b=>!b.gone&&!b.dead);
 };
 AI.ACTS.wildHunt={nameTh:'ล่าอสูรใกล้สำนัก',icon:'🐺',color:'#b67862',
  can:(n,W)=>!!(W.wildlife&&n.rank>=1&&!n.dead&&!n.away&&!n.inj?.length&&n.h.state.hp>CULT.hpMax(n)*.6&&W.wildlife.beasts.some(b=>!b.dead&&!b.gone&&!b.fighting&&CULT.power(n)>=b.power*.8)),
  score(n,W,S){S.add('ชอบล่าและต่อสู้',(HC.eff(n,'interests.combat')-35)/40+(HC.eff(n,'interests.exploring')-40)/60);S.add('ต้องการวัตถุดิบ',.3);},
  where(W,n){const candidates=W.wildlife.beasts.filter(b=>!b.dead&&!b.gone&&!b.fighting&&CULT.power(n)>=b.power*.8);candidates.sort((a,b)=>Math.hypot(n.x-a.x,n.y-a.y)-Math.hypot(n.x-b.x,n.y-b.y));const b=candidates[0];return b?{pos:{x:b.x,y:b.y},beastId:b.id}:null;},
  start(n,W,ctx){const b=W.wildlife.beasts.find(b=>b.id===ctx.beastId);return !!b&&WILD.startFight(W,n,b);},dur:()=>1,tick(){},done(){} };
 g.WILD=WILD;if(typeof module==='object'&&module.exports)module.exports=WILD;
})(typeof globalThis!=='undefined'?globalThis:this);
