/* Shared scripture access is paid once per disciple and art, never per reading
   tick. The physical book stays communal; knowledge still requires native study. */
(function(root){'use strict';
const C=root.JianghuSectContributions,H=root.HumanCore;
const now=g=>Number(g.s.t)||0;
const accounts=g=>g.s.storyEvents?.treasury?.contributions?.accounts||{};
const licenses=g=>g.s.storyEvents?.treasury?.contributions?.learningLicenses||{};
function capacity(g){return root.JianghuInfrastructure?.bonuses(g)?.libraryCapacity||120;}
function quote(g,n,artId){
 const art=g.progression?.artMap?.get(artId),book=(g.s.growth.scriptureLibrary||[]).find(x=>x.artId===artId);
 const basic=(g.s.growth.sectArtIds||[]).includes(artId);
 const tier=Math.max(1,Number(art?.requiredNormalizedTier||art?.tier||book?.tier)||1);
 const paid=!!licenses(g)[n?.id]?.[artId];
 const baseFee=basic?0:Math.round(12*Math.pow(tier,1.6));
 const fee=paid?0:baseFee,balance=accounts(g)[n?.id]?.balance||0;
 const available=!!(n?.alive&&g.s.heroIds.includes(n.id)&&book&&art&&!art.innateRoute&&g.progression.compatible(n,art)&&g.progression.canStudyArtTier(n,art)&&(!g.discovery||g.discovery.canStudy(n,art)));
 const learned=(n?.jianghu?.knowledgeV190?.[artId]?.stage||0)>=4;
 return {ok:available,artId,nameTh:art?.nameTh||book?.nameTh||artId,tier,basic,paid,baseFee,fee,balance,canAfford:balance>=fee,deficit:Math.max(0,fee-balance),learned,reason:!available?'วิชาหรือขอบเขตยังไม่เหมาะกับศิษย์':balance<fee?'ต้องสะสมแต้มคุณูปการเพิ่มก่อนลงทะเบียน':'พร้อมศึกษาในหอคัมภีร์'};
}
function enroll(g,n,artId){
 const q=quote(g,n,artId);if(!q.ok||!q.canAfford)return {...q,ok:false};
 if(q.fee===0)return {ok:true,fee:0};
 const a=C.account(g,n);if(a.balance<q.fee)return {ok:false,reason:'แต้มคุณูปการไม่พอ'};
 const s=g.s.storyEvents.treasury.contributions;s.learningLicenses=s.learningLicenses||{};s.learningLicenses[n.id]=s.learningLicenses[n.id]||{};
 s.learningLicenses[n.id][artId]={fee:q.fee,paidAt:now(g)};a.balance-=q.fee;a.spent+=q.fee;
 const book=g.s.growth.scriptureLibrary.find(x=>x.artId===artId);
 C.recordTransaction(g,n,'LIBRARY_ENROLL',book,1,-q.fee,{artId,compartment:'SCRIPTURE_LIBRARY'});
 g.note(n.name+' ใช้แต้มคุณูปการ '+q.fee+' ลงทะเบียนศึกษา «'+q.nameTh+'» ในหอคัมภีร์ (ชำระครั้งเดียว ต้องอ่านและฝึกจริง)',n);
 return {ok:true,fee:q.fee};
}
function desires(g,n){
 if(!g.built('shrine')||!n?.alive)return [];
 const out=[];
 for(const book of g.s.growth.scriptureLibrary||[]){
  const q=quote(g,n,book.artId);if(!q.ok||q.learned||(n.jianghu.ledgerV140.scrolls||[]).some(x=>x.artId===book.artId))continue;
  const art=g.progression.artMap.get(book.artId),suit=g.progression.scoreArtSuitability(n,art);
  if(suit.eligible===false||suit.score<0)continue;
  const urgency=Math.min(85,Math.max(45,Math.round(52+suit.score*.25+(suit.fillsOpenSlot?6:0))));
  out.push({kind:'LESSON',id:book.artId,nameTh:q.nameTh,price:q.fee,deficit:q.deficit,urgency,tier:q.tier,suitability:suit.score,reasonTh:`ศึกษา «${q.nameTh}» ในหอคัมภีร์ · ${suit.reasonsTh?.slice(0,2).join(' · ')||'วิชาเข้ากับมรรคา'} · ${q.paid?'ชำระค่าเรียนแล้ว':q.basic?'วิชาพื้นฐานเรียนฟรี':'ค่าเรียน '+q.fee+' แต้ม (ครั้งเดียว)'}`});
 }
 return out.sort((a,b)=>b.urgency-a.urgency||b.suitability-a.suitability||a.price-b.price);
}
function member(g,n){return root.JianghuStoryEvents.treasuryTools.memberAvailable(g,n,true);}
function authority(g,id=null){
 const offices=g.s.life.offices;
 const people=[offices.scriptureElder?.npcId,offices.master?.npcId].map(x=>g.world.npcs[x]).filter(n=>member(g,n));
 return people.find(n=>!id||n.id===id)||null;
}
function appoint(g){
 if(!g.built('shrine'))return null;
 const offices=g.s.life.offices,current=g.world.npcs[offices.scriptureElder?.npcId];
 if(current?.alive&&g.s.heroIds.includes(current.id))return current;
 const list=g.heroes.filter(n=>member(g,n));
 list.sort((a,b)=>(H.capacity(b,'readScripture').total+(b.core.values.knowledgeCraft||50)*.4)-(H.capacity(a,'readScripture').total+(a.core.values.knowledgeCraft||50)*.4)||a.id.localeCompare(b.id));
 const chosen=list.find(n=>n.id!==offices.master?.npcId)||list[0];
 if(chosen){offices.scriptureElder={npcId:chosen.id,appointedAt:now(g)};g.life.syncLegacyPositions();g.note(chosen.name+' ได้รับหน้าที่ผู้อาวุโสหอคัมภีร์ พิจารณาคัมภีร์จากคนนอกตามประโยชน์ต่อศิษย์');}
 return chosen||null;
}
function visitorOffer(g,s,seller){
 const pool=g.progression.arts.filter(a=>!a.innateRoute&&!(g.s.growth.sectArtIds||[]).includes(a.id)&&!g.s.growth.scriptureLibrary.some(b=>b.artId===a.id)&&g.heroes.some(n=>n.alive&&g.progression.compatible(n,a)&&g.progression.canStudyArtTier(n,a)&&g.discovery.canStudy(n,a)));
 if(!pool.length)return null;
 pool.sort((a,b)=>(b.tier||1)-(a.tier||1)||a.id.localeCompare(b.id));
 const art=pool[(s.visit-1)%Math.min(pool.length,12)],tier=Math.max(1,Number(art.requiredNormalizedTier||art.tier)||1);
 const item={id:'outside_scripture_'+g.s.nextId++,artId:art.id,nameTh:art.nameTh,tier,rights:'OWNER',access:'PRIVATE',canRedistribute:true,count:1,ownerNpcId:seller.id,ownerId:seller.id,originLabelTh:'คัมภีร์ที่พ่อค้านำมาจากยุทธภพ'};
 seller.jianghu.ledgerV140.scrolls.push(item);
 const stones=Math.max(18,Math.round(16*Math.pow(tier,1.7)));
 return {id:'outside_offer_'+g.s.nextId++,sellerNpcId:seller.id,sellerNameTh:seller.name,kind:'SCROLL',itemId:item.id,artId:art.id,nameTh:art.nameTh,quantity:1,unitStones:stones,totalStones:stones,tier,createdAt:now(g),expiresAt:now(g)+100,status:'PENDING'};
}
function assess(g,o){
 const officer=authority(g);if(!officer||!g.built('shrine')||g.s.growth.scriptureLibrary.length>=capacity(g)||g.s.growth.scriptureLibrary.some(b=>b.artId===o.artId))return {score:-999,actor:null,reason:'หอคัมภีร์ไม่พร้อมหรือมีวิชานี้อยู่แล้ว'};
 const art=g.progression.artMap.get(o.artId);if(!art)return {score:-999,actor:officer};
 const fits=g.heroes.filter(n=>n.alive&&!(n.jianghu.knowledgeV190[art.id]?.stage>=4)&&g.progression.compatible(n,art)&&g.progression.canStudyArtTier(n,art)&&g.discovery.canStudy(n,art));
 const best=Math.max(0,...fits.map(n=>g.progression.scoreArtSuitability(n,art).score));
 const score=fits.length*20+best*.25+(officer.core.values.knowledgeCraft-50)*.16-(officer.core.values.wealthResource-50)*.14-o.totalStones*.08;
 return {score:fits.length?score:-999,actor:officer,reason:`เหมาะกับศิษย์ ${fits.length} คน · ค่าความเหมาะสมสูงสุด ${Math.round(best)} · ต้นทุน ${o.totalStones} หินวิญญาณ`};
}
root.JianghuSectLibrary={quote,enroll,desires,authority,appoint,visitorOffer,assess,capacity};C.libraryQuote=quote;C.enrollLibrary=enroll;
})(typeof globalThis!=='undefined'?globalThis:this);
