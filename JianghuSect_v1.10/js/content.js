/* v1.10.9: native content integration + personal recipe scroll lifecycle +
 * rare organs, property experimentation, and factions/world politics.
 * One W, native ownership/AI/combat, no source engine. */
(function(g) {
  'use strict';
  const D=g.JD.EXPANSION, U=g.U, ECO=g.ECO, CULT=g.CULT, X=g.EXPED, CPE=g.CPE, HC=g.HC, SECT=g.SECT, AI=g.AI;
  const C={VERSION:3}, clamp=U.clamp;
  const regionById=Object.fromEntries(D.regions.map(r=>[r.id,r]));
  const premiumPills=D.recipes.filter(r=>r.outType==='PILL');
  const recipeIds=new Set(D.recipes.map(r=>r.id));
  const techIds=new Set(D.techniques.map(t=>t.id));
  const rareOrgans=D.rareOrgans||[];
  const organById=Object.fromEntries(rareOrgans.map(o=>[o.id,o]));
  const organByBeastId=Object.fromEntries(rareOrgans.map(o=>[o.beastId,o]));
  const experiments=D.experiments||[];
  const experimentById=Object.fromEntries(experiments.map(e=>[e.id,e]));
  const experimentsByRecipeId={};
  experiments.forEach(e=>{
    if(!experimentsByRecipeId[e.linkedRecipeId]) experimentsByRecipeId[e.linkedRecipeId]=[];
    experimentsByRecipeId[e.linkedRecipeId].push(e);
  });
  const factions=D.factions||[];
  const factionById=Object.fromEntries(factions.map(f=>[f.id,f]));

  C.regions=D.regions; C.regionById=regionById;
  C.rareOrgans=rareOrgans; C.organById=organById; C.organByBeastId=organByBeastId;
  C.experiments=experiments; C.experimentById=experimentById;
  C.factions=factions; C.factionById=factionById;

  const METRIC_KEYS=['gathered','hunted','formulas','manuals','expeditions','formulasKept','formulasDonated','formulasTraded','formulasCopied','formulasAuthorized','organsHarvested','organsDamaged','organsRefined','organsDonated','experimentsRun','experimentsSucceeded','treatiesSigned','politicalEvents'];
  const POLITICS_STAT_KEYS=['treatiesSigned','tradeShipments','tributesPaid','crisesResolved','jointDefenses'];

  C.ensure=W=>{
    if(g.SECT && g.SECT.ensureDirectives) g.SECT.ensureDirectives(W);
    if(!Array.isArray(W.sect.knownRecipes)) W.sect.knownRecipes=[];
    else W.sect.knownRecipes=Array.from(new Set(W.sect.knownRecipes.filter(id=>!!ECO.recipeById[id])));
    if(!W.sect.recipeAuth || typeof W.sect.recipeAuth!=='object') W.sect.recipeAuth={};
    if(!W.sect.organs || typeof W.sect.organs!=='object' || Array.isArray(W.sect.organs)) W.sect.organs={};
    Object.keys(W.sect.organs).forEach(k=>{
      if(!organById[k] || !Number.isFinite(W.sect.organs[k]) || W.sect.organs[k]<=0) delete W.sect.organs[k];
      else W.sect.organs[k]=Math.floor(W.sect.organs[k]);
    });
    if(!W.sect.experiments || typeof W.sect.experiments!=='object' || Array.isArray(W.sect.experiments)) W.sect.experiments={};
    const expState=W.sect.experiments;
    if(!Array.isArray(expState.discovered)) expState.discovered=[];
    else expState.discovered=Array.from(new Set(expState.discovered.filter(id=>!!experimentById[id])));
    if(!expState.propertyKnowledge || typeof expState.propertyKnowledge!=='object' || Array.isArray(expState.propertyKnowledge)) expState.propertyKnowledge={};
    if(!Array.isArray(expState.notes)) expState.notes=[];
    else if(expState.notes.length>30) expState.notes.splice(0,expState.notes.length-30);
    if(!Array.isArray(expState.history)) expState.history=[];
    else if(expState.history.length>40) expState.history.splice(0,expState.history.length-40);

    if(!W.world.contentSites) W.world.contentSites={};
    if(!W.world.contentHistory) W.world.contentHistory=[];
    if(!W.world.contentMetrics || typeof W.world.contentMetrics!=='object') W.world.contentMetrics={};
    const m=W.world.contentMetrics;
    METRIC_KEYS.forEach(k=>{if(!Number.isFinite(m[k])||m[k]<0) m[k]=0;});

    if(!W.world.politics || typeof W.world.politics!=='object' || Array.isArray(W.world.politics)) W.world.politics={};
    const pol=W.world.politics;
    if(!pol.treaties || typeof pol.treaties!=='object' || Array.isArray(pol.treaties)) pol.treaties={};
    if(pol.activeEvent===undefined) pol.activeEvent=null;
    if(!Array.isArray(pol.events)) pol.events=[];
    else if(pol.events.length>40) pol.events.splice(0,pol.events.length-40);
    if(!pol.stats || typeof pol.stats!=='object') pol.stats={};
    POLITICS_STAT_KEYS.forEach(k=>{if(!Number.isFinite(pol.stats[k])||pol.stats[k]<0) pol.stats[k]=0;});

    if(Array.isArray(W.world.sects) && factions.length) {
      W.world.sects.forEach((s,i)=>{
        if(!s) return;
        const f= (s.factionId && factionById[s.factionId]) || factions[i % factions.length];
        if(!f) return;
        s.factionId=f.id;
        s.code=f.code;
        s.factionNameTh=f.nameTh;
        s.shortTh=f.shortTh;
        s.icon=f.icon;
        s.alignment=f.alignment;
        s.alignmentLabelTh=f.alignmentLabelTh;
        s.majorPath=f.majorPath;
        s.specialtyTh=f.specialtyTh;
        s.leaderNameTh=f.leaderNameTh;
        s.specialtyMatIds=Array.isArray(f.specialtyMatIds)?f.specialtyMatIds.slice():[];
        s.treatyPref=f.treatyPref||'NONE';
        s.doctrineBonus=Object.assign({},f.doctrineBonus||{});
        if(!s.treaty) s.treaty=(pol.treaties[s.id] && pol.treaties[s.id].type) || 'NONE';
        if(!Number.isFinite(s.influence)) s.influence=Math.round(50+(s.power||1)*20);
      });
    }

    (W.npcs||[]).forEach(n=>{
      if(!n) return;
      if(n.inv && Array.isArray(n.inv.recipes)) n.inv.recipes=Array.from(new Set(n.inv.recipes.filter(id=>!!ECO.recipeById[id])));
      if(n.inv && n.inv.organs && typeof n.inv.organs==='object') {
        Object.keys(n.inv.organs).forEach(k=>{
          if(!organById[k] || !Number.isFinite(n.inv.organs[k]) || n.inv.organs[k]<=0) delete n.inv.organs[k];
          else n.inv.organs[k]=Math.floor(n.inv.organs[k]);
        });
      }
      const auth=Array.isArray(W.sect.recipeAuth[n.id])?W.sect.recipeAuth[n.id]:[];
      if(Array.isArray(n.recipes) || auth.length) {
        const merged=Array.from(new Set((n.recipes||[]).concat(auth).filter(id=>!!ECO.recipeById[id])));
        n.recipes=merged;
        if(merged.length) W.sect.recipeAuth[n.id]=merged.slice();
      }
    });
    W.sect.contentVersion=C.VERSION;
    return m;
  };

  /* ---------- Formula Discovery & Single-Scroll Provenance ---------- */
  C.formulaHolders=(W,id)=>{
    if(!W||!Array.isArray(W.npcs)) return [];
    return W.npcs.filter(n=>n && !n.dead && n.inv && Array.isArray(n.inv.recipes) && n.inv.recipes.includes(id));
  };
  C.formulaInWorld=(W,id,out)=>{
    C.ensure(W);
    if(W.sect.knownRecipes.includes(id)) return true;
    if(out && Array.isArray(out.recipes) && out.recipes.includes(id)) return true;
    if(C.formulaHolders(W,id).length>0) return true;
    if(W.sect && Array.isArray(W.sect.queue) && W.sect.queue.some(n=>n&&n.inv&&Array.isArray(n.inv.recipes)&&n.inv.recipes.includes(id))) return true;
    if(W.world && Array.isArray(W.world.expeds) && W.world.expeds.some(e=>e&&!e.done&&e.out&&Array.isArray(e.out.recipes)&&e.out.recipes.includes(id))) return true;
    return false;
  };

  /* ---------- Formula Valuation, Authorization & Learning Fees ---------- */
  C.recipeReward=(W,id)=>{
    const r=ECO.recipeById[id];
    return r ? 12*(r.tier||1) : 0;
  };
  C.recipeTradePrice=(W,id)=>{
    const r=ECO.recipeById[id];
    if(!r) return 0;
    return Math.max(15, Math.round(24*Math.pow(r.tier||1,1.65)));
  };
  C.isRecipeAuthorized=(W,n,id)=>{
    if(!W||!n||!id) return false;
    const r=ECO.recipeById[id];
    if(!r) return false;
    if(!r.discoverable) return true;
    if(Array.isArray(n.recipes) && n.recipes.includes(id)) return true;
    if(W.sect && W.sect.recipeAuth && Array.isArray(W.sect.recipeAuth[n.id]) && W.sect.recipeAuth[n.id].includes(id)) return true;
    return false;
  };
  C.grantRecipeAuth=(W,n,id)=>{
    if(!W||!n||!id||!ECO.recipeById[id]) return false;
    C.ensure(W);
    n.recipes=Array.isArray(n.recipes)?n.recipes:[]; if(!n.recipes.includes(id)) n.recipes.push(id);
    const list=W.sect.recipeAuth[n.id]||(W.sect.recipeAuth[n.id]=[]);
    if(!list.includes(id)) list.push(id);
    return true;
  };
  C.recipeFee=(W,rOrId,n)=>{
    const r=typeof rOrId==='string'?ECO.recipeById[rOrId]:rOrId;
    if(!r||!r.discoverable) return 0;
    if(n && C.isRecipeAuthorized(W,n,r.id)) return 0;
    if(n && n.inv && Array.isArray(n.inv.recipes) && n.inv.recipes.includes(r.id)) return 0;
    const price=(CPE && CPE.S(W).price)||1;
    return Math.max(4, Math.round(6*Math.pow(r.tier||1,1.6)*price));
  };
  C.canAuthorizeRecipe=(W,n,rOrId)=>{
    const r=typeof rOrId==='string'?ECO.recipeById[rOrId]:rOrId;
    if(!W||!n||n.dead||!r) return false;
    if(!r.discoverable) return true;
    if(C.isRecipeAuthorized(W,n,r.id)) return true;
    const ownsScroll=!!(n.inv && Array.isArray(n.inv.recipes) && n.inv.recipes.includes(r.id));
    const inLibrary=Array.isArray(W.sect.knownRecipes) && W.sect.knownRecipes.includes(r.id);
    if(!ownsScroll && (!inLibrary || r.tier>(W.sect.recipeTier||1))) return false;
    const paths=Array.isArray(r.compatiblePath)?r.compatiblePath:[r.compatiblePath||'ANY'];
    if(!paths.includes('ANY') && (!n.cult || !paths.includes(n.cult.path))) return false;
    if(r.minStage && (!n.cult || n.cult.stage<r.minStage)) return false;
    if(ownsScroll) return true;
    const hall=r.craft==='ALCHEMY'?'alchemy':'forge';
    if(n.post===hall || n.assist===hall || n.rank>=4 || n.id===W.sect.masterId) return true;
    const maxTier=SECT && SECT.canLearnTier ? SECT.canLearnTier(W,n) : (n.rank+1);
    return maxTier>=r.tier;
  };
  C.authorizeRecipe=(W,n,id)=>{
    C.ensure(W);
    const r=ECO.recipeById[id];
    if(!r||!n||n.dead) return {ok:false,reason:'invalid',fee:0};
    if(!r.discoverable) return {ok:true,already:true,fee:0,source:'basic'};
    if(C.isRecipeAuthorized(W,n,id)) return {ok:true,already:true,fee:0,source:'authorized'};
    if(!C.canAuthorizeRecipe(W,n,r)) return {ok:false,reason:'unauthorized',fee:0};
    const ownsScroll=!!(n.inv && Array.isArray(n.inv.recipes) && n.inv.recipes.includes(id));
    const fee=ownsScroll?0:C.recipeFee(W,r,n);
    if(fee>0) {
      if(!CPE.spend(W,n,fee,'ขอสิทธิ์ศึกษาตำรับ「'+r.nameTh+'」')) return {ok:false,reason:'insufficient-cp',fee};
      const cp=CPE.S(W);
      cp.recipeFees=(cp.recipeFees||0)+fee;
      cp.recipeAuthorizations=(cp.recipeAuthorizations||0)+1;
    }
    C.grantRecipeAuth(W,n,id);
    W.world.contentMetrics.formulasAuthorized++;
    return {ok:true,already:false,fee,source:ownsScroll?'scroll':'library'};
  };
  C.learnRecipe=C.authorizeRecipe;

  /* ---------- Personal Scroll Ownership: Donate / Trade / Copy ---------- */
  C.donateRecipe=(W,n,id,opts)=>{
    opts=opts||{};
    C.ensure(W);
    const r=ECO.recipeById[id];
    if(!r||!n||n.dead||!n.inv||!Array.isArray(n.inv.recipes)||!n.inv.recipes.includes(id)) {
      return {ok:false,duplicate:false,reward:0,reason:'not-owned'};
    }
    n.inv.recipes=n.inv.recipes.filter(x=>x!==id);
    C.grantRecipeAuth(W,n,id);
    if(W.sect.knownRecipes.includes(id)) {
      if(!opts.quiet) W.log('research',n.h.name.given+' ส่งมอบม้วนตำรับซ้ำ「'+r.nameTh+'」เข้าหอคัมภีร์ (มีอยู่แล้ว ได้ 0 คป.)',[n.id]);
      return {ok:true,duplicate:true,reward:0};
    }
    W.sect.knownRecipes.push(id);
    const reward=C.recipeReward(W,id);
    CPE.mint(W,n,reward,'บริจาคม้วนตำรับ「'+r.nameTh+'」',!!opts.quiet);
    CPE.S(W).donated+=reward;
    W.world.contentMetrics.formulas++;
    W.world.contentMetrics.formulasDonated++;
    if(!opts.quiet) W.log('research',n.h.name.given+' บริจาคม้วนตำรับ「'+r.nameTh+'」เข้าสู่หอคัมภีร์ ได้ '+Math.round(reward)+' คป.',[n.id]);
    return {ok:true,duplicate:false,reward};
  };

  C.tradeRecipe=(W,seller,buyer,id,price)=>{
    C.ensure(W);
    const r=ECO.recipeById[id];
    if(!r||!seller||seller.dead||!buyer||seller===buyer) return {ok:false,reason:'invalid-party'};
    if(!seller.inv||!Array.isArray(seller.inv.recipes)||!seller.inv.recipes.includes(id)) return {ok:false,reason:'not-owned'};
    const quote=price!=null?price:C.recipeTradePrice(W,id);
    if(!Number.isFinite(quote)||quote<=0||!Number.isSafeInteger(Math.round(quote))) return {ok:false,reason:'invalid-price'};
    const total=Math.round(quote);
    if(buyer.kind==='trader') {
      if(!(buyer.untilDay>=W.day)||!Number.isFinite(buyer.stones)||buyer.stones<total) return {ok:false,reason:'insufficient-buyer-stones'};
      seller.inv.recipes=seller.inv.recipes.filter(x=>x!==id);
      buyer.stones-=total;
      seller.inv.stones=(seller.inv.stones||0)+total;
      buyer.recipes=Array.isArray(buyer.recipes)?buyer.recipes:[];
      buyer.recipes.push(id);
      W.world.contentMetrics.formulasTraded++;
      if(Array.isArray(W.world.tradeHistory)) {
        W.world.tradeHistory.push({day:W.day,side:'member-sell-formula',itemId:'FORMULA:'+id,qty:1,unitPrice:total,total,traderId:buyer.id,traderName:buyer.nameTh,npcId:seller.id,npcName:seller.h.name.given});
        if(W.world.tradeHistory.length>60) W.world.tradeHistory.splice(0,W.world.tradeHistory.length-60);
      }
      W.log('finance',seller.h.name.given+' ขายม้วนตำรับ「'+r.nameTh+'」ให้'+buyer.nameTh+' '+total+' ศิลา',[seller.id]);
      return {ok:true,price:total,id,sellerId:seller.id,buyerId:buyer.id};
    }
    if(buyer.dead||!buyer.inv||!Number.isFinite(buyer.inv.stones)||buyer.inv.stones<total) return {ok:false,reason:'insufficient-buyer-stones'};
    buyer.inv.recipes=Array.isArray(buyer.inv.recipes)?buyer.inv.recipes:[];
    if(buyer.inv.recipes.includes(id)) return {ok:false,reason:'buyer-already-owns'};
    seller.inv.recipes=seller.inv.recipes.filter(x=>x!==id);
    buyer.inv.recipes.push(id);
    buyer.inv.stones-=total;
    seller.inv.stones=(seller.inv.stones||0)+total;
    W.world.contentMetrics.formulasTraded++;
    W.log('finance',buyer.h.name.given+' ซื้อม้วนตำรับ「'+r.nameTh+'」ต่อจาก '+seller.h.name.given+' ('+total+' ศิลา)',[buyer.id,seller.id]);
    return {ok:true,price:total,id,sellerId:seller.id,buyerId:buyer.id};
  };

  C.copyRecipe=(W,actor,id,targetNpc)=>{
    C.ensure(W);
    const r=ECO.recipeById[id];
    if(!r||!actor||actor.dead||!actor.inv) return {ok:false,reason:'invalid-actor'};
    const ownsScroll=Array.isArray(actor.inv.recipes)&&actor.inv.recipes.includes(id);
    const fromLibrary=W.sect.knownRecipes.includes(id)&&C.isRecipeAuthorized(W,actor,id);
    if(!ownsScroll&&!fromLibrary) return {ok:false,reason:'no-source-access'};
    const literacy=Math.max(actor.h.skills.SCRIPTURE||0,actor.h.skills[r.craft]||0,actor.rank>=3?25:0);
    if(literacy<10) return {ok:false,reason:'insufficient-literacy'};
    const dest=targetNpc||actor;
    if(!dest||dest.dead||!dest.inv) return {ok:false,reason:'invalid-target'};
    dest.inv.recipes=Array.isArray(dest.inv.recipes)?dest.inv.recipes:[];
    if(dest!==actor && dest.inv.recipes.includes(id)) return {ok:false,reason:'target-already-holds'};
    if(dest===actor && ownsScroll && C.isRecipeAuthorized(W,actor,id)) return {ok:false,reason:'already-transcribed'};
    const inkMat='MAT_ORE_CINNABAR_1', stoneCost=8*(r.tier||1);
    let costKind='stones', cost=stoneCost;
    if(actor.inv.mats && (actor.inv.mats[inkMat]||0)>=1) {
      actor.inv.mats[inkMat]--;
      if(actor.inv.mats[inkMat]<=0) delete actor.inv.mats[inkMat];
      costKind='mat'; cost=1;
    } else if((actor.inv.stones||0)>=stoneCost) {
      actor.inv.stones-=stoneCost;
    } else {
      return {ok:false,reason:'insufficient-copy-materials'};
    }
    C.grantRecipeAuth(W,actor,id);
    if(!dest.inv.recipes.includes(id)) dest.inv.recipes.push(id);
    (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(actor,'SCRIPTURE',0.5,1);
    W.world.contentMetrics.formulasCopied++;
    W.log('research',actor.h.name.given+' คัดลอกม้วนตำรับ「'+r.nameTh+'」'+(dest!==actor?' ให้ '+dest.h.name.given:''),[actor.id].concat(dest!==actor?[dest.id]:[]));
    return {ok:true,id,from:actor.id,to:dest.id,costKind,cost};
  };

  /* ---------- v1.10.9: Rare Beast Organs (Harvesting, Donation, Refinement) ---------- */
  C.organCount=(W,organId)=>{
    C.ensure(W);
    const n=W.sect.organs[organId];
    return Number.isFinite(n)&&n>0?Math.floor(n):0;
  };
  C.addOrgan=(W,organId,qty)=>{
    C.ensure(W);
    if(!organById[organId]||!Number.isSafeInteger(qty)||qty<=0) return false;
    W.sect.organs[organId]=(W.sect.organs[organId]||0)+qty;
    return true;
  };
  C.takeOrgan=(W,organId,qty)=>{
    C.ensure(W);
    if(!organById[organId]||!Number.isSafeInteger(qty)||qty<=0) return false;
    const have=C.organCount(W,organId);
    if(have<qty) return false;
    if(have>qty) W.sect.organs[organId]=have-qty;
    else delete W.sect.organs[organId];
    return true;
  };
  C.harvestOrgan=(W,ex,alive,out,reg,beast,opts)=>{
    opts=opts||{};
    C.ensure(W);
    if(!alive||!alive.length||!out) return {ok:false,mutated:false,reason:'no-party'};
    const organ=(opts.organId && organById[opts.organId]) || (beast && organByBeastId[beast.id]) || rareOrgans.find(o=>o.regionId===(reg&&reg.id));
    if(!organ) return {ok:false,mutated:false,reason:'no-eligible-organ'};
    const mutProb=clamp((organ.mutationChance||0.06)*(ex&&ex.kind==='hunt'?2.6:1.6)*(opts.mutationBoost||1),0.05,0.75);
    const mutated=!!opts.forceMutation || W.rng.chance(mutProb);
    if(!mutated) return {ok:false,mutated:false,organId:organ.id};
    const dissectSkill=Math.max(...alive.map(n=>(n.h.skills.survival||0)*0.4+(n.h.skills.MEDICINE||0)*0.35+HC.eff(n,'physiology.dexterity')*0.3+HC.eff(n,'intellect.perceptiveness')*0.25));
    const recChance=clamp(0.42+(dissectSkill-organ.dissectionDifficulty)*0.012,0.15,0.96);
    const recovered=!!opts.guaranteeRecovery || (!opts.forceDamage && W.rng.chance(recChance));
    alive.forEach(n=>{(g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(n,'survival',0.35,1);(g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(n,'MEDICINE',0.25,1);});
    if(organ.propertyTags && organ.propertyTags.length) {
      const t0=organ.propertyTags[0];
      W.sect.experiments.propertyKnowledge[t0]=(W.sect.experiments.propertyKnowledge[t0]||0)+1;
    }
    if(recovered) {
      out.organs=out.organs||{};
      out.organs[organ.id]=(out.organs[organ.id]||0)+1;
      W.world.contentMetrics.organsHarvested++;
      if(ex && Array.isArray(ex.journal)) ex.journal.push('ผ่าเก็บอวัยวะพิเศษ「'+organ.nameTh+'」สำเร็จ');
      return {ok:true,mutated:true,recovered:true,organId:organ.id,nameTh:organ.nameTh,dissectSkill:Math.round(dissectSkill)};
    }
    W.world.contentMetrics.organsDamaged++;
    if(ex && Array.isArray(ex.journal)) ex.journal.push('พบ「'+organ.nameTh+'」แต่อวัยวะเสียหายระหว่างชำแหละ');
    return {ok:false,mutated:true,recovered:false,damaged:true,organId:organ.id,nameTh:organ.nameTh,dissectSkill:Math.round(dissectSkill)};
  };
  C.donateOrgan=(W,npc,organId,qty,opts)=>{
    opts=opts||{};
    C.ensure(W);
    const organ=organById[organId];
    const n=qty==null?1:qty;
    if(!organ||!npc||npc.dead||!npc.inv||!npc.inv.organs||!Number.isSafeInteger(n)||n<=0||(npc.inv.organs[organId]||0)<n) {
      return {ok:false,reason:'not-owned',reward:0};
    }
    npc.inv.organs[organId]-=n;
    if(npc.inv.organs[organId]<=0) delete npc.inv.organs[organId];
    if(!Object.keys(npc.inv.organs).length) delete npc.inv.organs;
    C.addOrgan(W,organId,n);
    const reward=10*(organ.tier||1)*n;
    CPE.mint(W,npc,reward,'บริจาคอวัยวะพิเศษ「'+organ.nameTh+'」',!!opts.quiet);
    CPE.S(W).donated+=reward;
    W.world.contentMetrics.organsDonated+=n;
    if(!opts.quiet) W.log('research',npc.h.name.given+' บริจาคอวัยวะพิเศษ「'+organ.nameTh+'」×'+n+' เข้าคลังสำนัก ได้ '+reward+' คป.',[npc.id]);
    return {ok:true,organId,qty:n,reward};
  };
  C.refineOrgan=(W,npc,organId,opts)=>{
    opts=opts||{};
    C.ensure(W);
    const organ=organById[organId];
    if(!organ||!npc||npc.dead) return {ok:false,reason:'invalid'};
    const eff=organ.refineEffect||{};
    const stoneCost=opts.free?0:(eff.stoneCost||(16*(organ.tier||1)));
    const fromPersonal=!!(npc.inv && npc.inv.organs && (npc.inv.organs[organId]||0)>=1);
    const fromSect=C.organCount(W,organId)>=1;
    if(!fromPersonal && !fromSect) return {ok:false,reason:'missing-organ'};
    const paySect=W.sect.stones>=stoneCost;
    const payPersonal=!!(npc.inv && (npc.inv.stones||0)>=stoneCost);
    if(stoneCost>0 && !paySect && !payPersonal) return {ok:false,reason:'insufficient-stones',stoneCost};

    if(fromSect) C.takeOrgan(W,organId,1);
    else {
      npc.inv.organs[organId]--;
      if(npc.inv.organs[organId]<=0) delete npc.inv.organs[organId];
      if(!Object.keys(npc.inv.organs).length) delete npc.inv.organs;
    }
    if(stoneCost>0) {
      if(paySect) ECO.pay(W,stoneCost,'หลอมสกัดอวัยวะพิเศษ「'+organ.nameTh+'」');
      else npc.inv.stones-=stoneCost;
    }
    const applied={};
    if(eff.healHealth) {
      const beforeHp=npc.h.state.hp;
      npc.h.state.hp=Math.min(CULT.hpMax(npc),npc.h.state.hp+eff.healHealth);
      applied.healHealth=Math.round(npc.h.state.hp-beforeHp);
    }
    if(eff.healInjury && Array.isArray(npc.inj) && npc.inj.length) {
      npc.inj.shift();
      applied.healedInjury=1;
    }
    if(eff.clearToxic && npc.cult) {
      const beforeTox=npc.cult.toxic||0;
      npc.cult.toxic=Math.max(0,beforeTox-eff.clearToxic);
      applied.clearToxic=Math.round(beforeTox-npc.cult.toxic);
    }
    if(eff.clearHeartDemon) {
      const beforeHd=npc.h.state.heartDemon||0;
      npc.h.state.heartDemon=Math.max(0,beforeHd-eff.clearHeartDemon);
      applied.clearHeartDemon=Math.round(beforeHd-npc.h.state.heartDemon);
    }
    if(eff.qiRestore && npc.cult) {
      const addQi=Math.round(CULT.qiMax(npc)*eff.qiRestore);
      npc.h.state.qi=Math.min(CULT.qiMax(npc),(npc.h.state.qi||0)+addQi);
      applied.qiRestored=addQi;
    }
    if(eff.foundationBonus && npc.cult) {
      npc.cult.found=clamp((npc.cult.found||0)+eff.foundationBonus,0,0.5);
      applied.foundationBonus=eff.foundationBonus;
    }
    if(eff.cultivationProgress && npc.cult) {
      const gain=Math.round(eff.cultivationProgress*(1+npc.cult.stage*0.15));
      CULT.gain(npc,gain);
      applied.cultivationProgress=gain;
    }
    (organ.propertyTags||[]).forEach(tag=>{
      W.sect.experiments.propertyKnowledge[tag]=(W.sect.experiments.propertyKnowledge[tag]||0)+1;
    });
    (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(npc,'MEDICINE',0.8,1.1);
    (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(npc,'ALCHEMY',0.6,1.1);
    W.world.contentMetrics.organsRefined++;
    if(!opts.quiet) W.log('research',npc.h.name.given+' หลอมสกัด「'+organ.nameTh+'」ชุบชีพจรและตบะสำเร็จ',[npc.id]);
    return {ok:true,organId,npcId:npc.id,stoneCost,applied};
  };

  /* ---------- v1.10.9: Property-Based Experimentation ---------- */
  C.canRunExperiment=(W,npc,expOrId,opts)=>{
    opts=opts||{};
    C.ensure(W);
    const exp=typeof expOrId==='string'?experimentById[expOrId]:expOrId;
    if(!exp||!npc||npc.dead) return {ok:false,reason:'invalid'};
    const skill=Math.max(npc.h.skills[exp.discipline]||0,npc.h.skills[exp.workshop==='alchemy'?'ALCHEMY':'FORGING']||0);
    if(!opts.ignoreSkill && skill+15<exp.minMastery) return {ok:false,reason:'insufficient-skill',skill,required:exp.minMastery-15};
    for(const inp of exp.trialInputs) {
      const have=ECO.count(W,inp.matId)+((npc.inv&&npc.inv.mats&&npc.inv.mats[inp.matId])||0);
      if(have<inp.count) return {ok:false,reason:'missing-input',matId:inp.matId};
    }
    const stoneCost=opts.free?0:(exp.stoneCost||10);
    if(stoneCost>0 && W.sect.stones<stoneCost && (!npc.inv || (npc.inv.stones||0)<stoneCost)) {
      return {ok:false,reason:'insufficient-stones',stoneCost};
    }
    return {ok:true,exp,skill,stoneCost};
  };
  C.runExperiment=(W,npc,expOrId,opts)=>{
    opts=opts||{};
    const checkRes=C.canRunExperiment(W,npc,expOrId,opts);
    if(!checkRes.ok) return checkRes;
    const {exp,skill,stoneCost}=checkRes;
    // Atomically consume trial inputs (personal bag first, then sect stock)
    for(const inp of exp.trialInputs) {
      let rem=inp.count;
      if(npc.inv && npc.inv.mats && (npc.inv.mats[inp.matId]||0)>0) {
        const takeP=Math.min(rem,npc.inv.mats[inp.matId]);
        npc.inv.mats[inp.matId]-=takeP;
        if(npc.inv.mats[inp.matId]<=0) delete npc.inv.mats[inp.matId];
        rem-=takeP;
      }
      if(rem>0) ECO.take(W,inp.matId,rem);
    }
    if(stoneCost>0) {
      if(W.sect.stones>=stoneCost) ECO.pay(W,stoneCost,'วิจัยคุณสมบัติตำรับ「'+exp.nameTh+'」');
      else npc.inv.stones-=stoneCost;
    }
    let usedCatalyst=false;
    if(opts.useCatalyst!==false && exp.catalystOrganId) {
      if(C.takeOrgan(W,exp.catalystOrganId,1)) usedCatalyst=true;
      else if(npc.inv && npc.inv.organs && (npc.inv.organs[exp.catalystOrganId]||0)>=1) {
        npc.inv.organs[exp.catalystOrganId]--;
        if(npc.inv.organs[exp.catalystOrganId]<=0) delete npc.inv.organs[exp.catalystOrganId];
        if(!Object.keys(npc.inv.organs).length) delete npc.inv.organs;
        usedCatalyst=true;
      }
    }
    const expState=W.sect.experiments;
    (exp.requiredPropertyTags||[]).forEach(tag=>{
      expState.propertyKnowledge[tag]=(expState.propertyKnowledge[tag]||0)+1;
    });
    const priorNotes=expState.notes.filter(n=>n.expId===exp.id).length;
    const priorBonus=Math.min(0.28,priorNotes*0.14);
    const tagBonus=(exp.requiredPropertyTags||[]).reduce((s,t)=>s+Math.min(0.05,(expState.propertyKnowledge[t]||0)*0.02),0);
    const intellectBonus=(HC.eff(npc,'intellect.comprehension')+HC.eff(npc,'intellect.inventiveness')-90)/450;
    const catBonus=usedCatalyst?(exp.catalystBonusChance||0.18):0;
    const chance=clamp(0.42+(skill-exp.minMastery)*0.01+intellectBonus+priorBonus+tagBonus+catBonus,0.20,0.96);
    const success=opts.forceSuccess?true:opts.forceFail?false:W.rng.chance(chance);

    W.world.contentMetrics.experimentsRun++;
    (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(npc,exp.discipline,1.1,1.2);
    (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(npc,'SCRIPTURE',0.5,1);

    let unlockedRecipeId=null, prototype=null, rewardCp=0;
    if(success) {
      if(!expState.discovered.includes(exp.id)) expState.discovered.push(exp.id);
      if(exp.linkedRecipeId && ECO.recipeById[exp.linkedRecipeId]) {
        C.grantRecipeAuth(W,npc,exp.linkedRecipeId);
        if(!W.sect.knownRecipes.includes(exp.linkedRecipeId)) {
          W.sect.knownRecipes.push(exp.linkedRecipeId);
          unlockedRecipeId=exp.linkedRecipeId;
          W.world.contentMetrics.formulas++;
        }
        const r=ECO.recipeById[exp.linkedRecipeId];
        const syn=exp.synergyBonus||{};
        if(r.outType==='PILL') {
          const key=r.outItemId||'P:'+r.id;
          const qty=1+(syn.yieldBonus||0);
          ECO.add(W,key,qty);
          prototype={kind:'PILL',key,qty};
        } else if(r.outType==='EQUIPMENT') {
          const gear=ECO.mintGear(r,1.15+(syn.qualityBonus||0.12));
          gear.q=Math.round((1.15+(syn.qualityBonus||0.12))*100)/100;
          if(syn.combatMultBonus) gear.combatMult=(gear.combatMult||0)+syn.combatMultBonus;
          if(syn.defenseMultBonus) gear.defMult=(gear.defMult||0)+syn.defenseMultBonus;
          W.sect.gear.push(gear);
          prototype={kind:'EQUIPMENT',gear};
        }
      }
      rewardCp=15*(exp.tier||1);
      CPE.mint(W,npc,rewardCp,'ค้นพบสูตรประยุกต์「'+exp.nameTh+'」',!!opts.quiet);
      CPE.S(W).donated+=rewardCp;
      W.world.contentMetrics.experimentsSucceeded++;
      if(!opts.quiet) W.log('research',npc.h.name.given+' ทดลองคุณสมบัติสำเร็จ ค้นพบ「'+exp.nameTh+'」'+(usedCatalyst?' (เร่งด้วยอวัยวะพิเศษ)':''),[npc.id]);
    } else {
      expState.notes.push({day:W.day,expId:exp.id,npcId:npc.id,tags:(exp.requiredPropertyTags||[]).slice()});
      if(expState.notes.length>30) expState.notes.splice(0,expState.notes.length-30);
      if(exp.poisonous && npc.cult) {
        npc.cult.toxic=clamp((npc.cult.toxic||0)+6,0,100);
      }
      if(!opts.quiet) W.log('research',npc.h.name.given+' ทดลอง「'+exp.nameTh+'」ยังไม่สำเร็จ แต่บันทึกคุณสมบัติ ('+(exp.requiredPropertyTags||[]).join(', ')+') ไว้ต่อยอด',[npc.id]);
    }
    expState.history.push({day:W.day,expId:exp.id,npcId:npc.id,ok:success,usedCatalyst,unlockedRecipeId});
    if(expState.history.length>40) expState.history.splice(0,expState.history.length-40);
    return {ok:true,success,expId:exp.id,usedCatalyst,unlockedRecipeId,prototype,rewardCp,chance};
  };
  C.recipeSynergy=(W,recipeId)=>{
    C.ensure(W);
    const list=experimentsByRecipeId[recipeId];
    if(!list||!list.length) return null;
    const found=list.find(e=>W.sect.experiments.discovered.includes(e.id));
    return found?found.synergyBonus:null;
  };

  /* ---------- v1.10.9: Factions, Treaties & World Politics ---------- */
  const TREATY_TH={
    NONE:'ไม่มีสนธิสัญญา',
    TRADE_PACT:'สัญญาการค้าข้ามสำนัก',
    NON_AGGRESSION:'สนธิสัญญาไม่รุกราน',
    ALLIANCE:'พันธมิตรยุทธภพ',
    EMBARGO:'คว่ำบาตร/ปรปักษ์'
  };
  C.TREATY_TH=TREATY_TH;

  C.signTreaty=(W,sectOrId,treatyType,opts)=>{
    opts=opts||{};
    C.ensure(W);
    const s=typeof sectOrId==='string'?W.world.sects.find(x=>x.id===sectOrId||x.factionId===sectOrId||x.code===sectOrId):sectOrId;
    if(!s||!TREATY_TH[treatyType]) return {ok:false,reason:'invalid-sect-or-treaty'};
    const minAtt={TRADE_PACT:15,NON_AGGRESSION:5,ALLIANCE:45,NONE:-100,EMBARGO:-100}[treatyType];
    if(!opts.force && s.attitude<minAtt) return {ok:false,reason:'insufficient-attitude',attitude:s.attitude,required:minAtt};
    const cost=opts.free?0:({TRADE_PACT:40,NON_AGGRESSION:30,ALLIANCE:80,NONE:0,EMBARGO:0}[treatyType]||0);
    if(cost>0 && !ECO.pay(W,cost,'ทำ'+TREATY_TH[treatyType]+'กับ'+s.nameTh)) return {ok:false,reason:'insufficient-stones',cost};

    s.treaty=treatyType;
    s.contact=W.day;
    const pol=W.world.politics;
    if(treatyType==='NONE') {
      delete pol.treaties[s.id];
    } else {
      pol.treaties[s.id]={type:treatyType,signedDay:W.day,expiresDay:W.day+(opts.durationDays||90)};
    }
    const attDelta={ALLIANCE:10,TRADE_PACT:6,NON_AGGRESSION:4,NONE:0,EMBARGO:-15}[treatyType]||0;
    s.attitude=clamp(s.attitude+attDelta,-100,100);
    if(W.market && W.market.mult && Array.isArray(s.specialtyMatIds)) {
      s.specialtyMatIds.forEach(mId=>{
        const cur=W.market.mult[mId]||1;
        if(treatyType==='TRADE_PACT'||treatyType==='ALLIANCE') W.market.mult[mId]=Math.round(clamp(cur*0.9,0.65,1.7)*100)/100;
        else if(treatyType==='EMBARGO') W.market.mult[mId]=Math.round(clamp(cur*1.2,0.65,1.9)*100)/100;
      });
    }
    pol.stats.treatiesSigned++;
    W.world.contentMetrics.treatiesSigned++;
    pol.events.push({day:W.day,kind:'TREATY',sectId:s.id,treaty:treatyType,outcome:'SIGNED',summaryTh:'ทำ'+TREATY_TH[treatyType]+'กับ'+s.nameTh});
    if(pol.events.length>40) pol.events.splice(0,pol.events.length-40);
    if(!opts.quiet) W.log('mission','สำนักลงนาม「'+TREATY_TH[treatyType]+'」กับ'+s.nameTh,[]);
    return {ok:true,sectId:s.id,treaty:treatyType,cost,attitude:s.attitude};
  };

  C.spawnPoliticalEvent=(W,kind,sectOrId)=>{
    C.ensure(W);
    const pol=W.world.politics;
    const sects=W.world.sects||[];
    if(!sects.length) return null;
    let s=sectOrId?(typeof sectOrId==='string'?sects.find(x=>x.id===sectOrId||x.factionId===sectOrId||x.code===sectOrId):sectOrId):null;
    if(!kind) {
      const hostile=sects.find(x=>x.attitude<-25 || x.alignment==='DEMONIC');
      const friendly=sects.find(x=>x.attitude>=20 || x.treaty==='TRADE_PACT' || x.treaty==='ALLIANCE');
      if(hostile && W.day%36===0) { kind='TRIBUTE_DEMAND'; s=hostile; }
      else if(friendly && W.day%36===18) { kind='SPECIALTY_CARAVAN'; s=friendly; }
      else if(W.day%54===0) { kind='DOCTRINE_SUMMIT'; s=sects.find(x=>x.alignment==='RIGHTEOUS')||sects[0]; }
      else { kind='BORDER_HERB_DISPUTE'; s=sects[W.day % sects.length]; }
    }
    if(!s) s=sects[0];
    const matId=(s.specialtyMatIds && s.specialtyMatIds[0]) || D.materials[0].id;
    const templates={
      SPECIALTY_CARAVAN:{
        titleTh:'ขบวนแลกเปลี่ยนของวิเศษจาก'+s.nameTh,
        descTh:s.nameTh+'ส่งทูตการค้าเสนอแลกเปลี่ยน '+ECO.name(matId)+' ×3 กับศิลาวิญญาณ 24 ก้อน',
        demandStones:24, specialtyMatId:matId, specialtyQty:3
      },
      TRIBUTE_DEMAND:{
        titleTh:'คำขาดเรียกค่าคุ้มครองจาก'+s.nameTh,
        descTh:s.nameTh+'แผ่อิทธิพลกดดันชายแดน เรียกศิลา 50 ก้อน มิฉะนั้นจะปิดล้อมเส้นทางและส่งคนมาก่อกวน',
        demandStones:50, specialtyMatId:matId, specialtyQty:2
      },
      DOCTRINE_SUMMIT:{
        titleTh:'เทียบเชิญชุมนุมแลกเปลี่ยนมรรคากับ'+s.nameTh,
        descTh:s.nameTh+'จัดชุมนุมถกมรรคา ใช้ศิลา 25 ก้อนเป็นของขวัญเพื่อส่งศิษย์หลักไปรับการชี้แนะ',
        demandStones:25, specialtyMatId:matId, specialtyQty:2
      },
      BORDER_HERB_DISPUTE:{
        titleTh:'ข้อพิพาทแหล่งทรัพยากรชายแดนกับ'+s.nameTh,
        descTh:'ศิษย์'+s.nameTh+'อ้างสิทธิ์เหนือแหล่ง '+ECO.name(matId)+' บริเวณชายแดน ต้องตัดสินใจเจรจาแบ่งปันหรือแสดงกำลัง',
        demandStones:20, specialtyMatId:matId, specialtyQty:3
      }
    };
    const tpl=templates[kind]||templates.SPECIALTY_CARAVAN;
    const ev={
      id:'POL_'+W.day+'_'+s.id,
      kind,
      sectId:s.id,
      factionId:s.factionId,
      titleTh:tpl.titleTh,
      descTh:tpl.descTh,
      day:W.day,
      expiresDay:W.day+6,
      demandStones:tpl.demandStones,
      specialtyMatId:tpl.specialtyMatId,
      specialtyQty:tpl.specialtyQty,
      resolved:false
    };
    pol.activeEvent=ev;
    W.world.contentMetrics.politicalEvents++;
    return ev;
  };

  C.resolvePoliticalEvent=(W,choice,actor)=>{
    C.ensure(W);
    const pol=W.world.politics, ev=pol.activeEvent;
    if(!ev||ev.resolved) return {ok:false,reason:'no-active-event'};
    const s=W.world.sects.find(x=>x.id===ev.sectId)||W.world.sects[0];
    const lead=actor||SECT.holder(W,'mission')||W.byId[W.sect.masterId]||W.npcs.find(n=>!n.dead);
    let outcome='RESOLVED', summaryTh='', deltaAtt=0, stonesDelta=0, matAdded=0;

    if(ev.kind==='SPECIALTY_CARAVAN') {
      if(choice==='ACCEPT' && W.sect.stones>=ev.demandStones) {
        ECO.pay(W,ev.demandStones,'แลกเปลี่ยนทรัพยากรพิเศษกับ'+s.nameTh);
        ECO.add(W,ev.specialtyMatId,ev.specialtyQty);
        stonesDelta=-ev.demandStones; matAdded=ev.specialtyQty; deltaAtt=6;
        outcome='ACCEPTED';
        summaryTh='รับขบวนสินค้าจาก'+s.nameTh+' ได้ '+ECO.name(ev.specialtyMatId)+' ×'+ev.specialtyQty;
      } else {
        deltaAtt=-2; outcome='DECLINED';
        summaryTh='ปฏิเสธขบวนแลกเปลี่ยนจาก'+s.nameTh;
      }
    } else if(ev.kind==='TRIBUTE_DEMAND') {
      const dipSkill=lead?(HC.eff(lead,'social.charisma')*0.5+(lead.h.skills.diplomacy||0)*0.6):35;
      if(choice==='PARLEY' && dipSkill>=45) {
        deltaAtt=5; outcome='PARLEY_SUCCESS';
        if(lead) (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(lead,'diplomacy',1.2,1.2);
        summaryTh=(lead?lead.h.name.given:'ทูตสำนัก')+' เจรจาคลี่คลายคำขาดของ'+s.nameTh+' โดยไม่ต้องเสียศิลา';
      } else if(choice==='PAY' && W.sect.stones>=ev.demandStones) {
        ECO.pay(W,ev.demandStones,'จ่ายค่าคุ้มครองชายแดนให้'+s.nameTh);
        stonesDelta=-ev.demandStones; deltaAtt=8; outcome='PAID';
        pol.stats.tributesPaid++;
        summaryTh='จ่ายศิลา '+ev.demandStones+' ก้อนให้'+s.nameTh+' เพื่อรักษาความสงบชายแดน';
      } else {
        deltaAtt=-10; outcome='DEFIED';
        W.fame(2);
        if(s.attitude-10<=-55) s.treaty='EMBARGO';
        summaryTh='ปฏิเสธคำขาดของ'+s.nameTh+' ยืนหยัดรักษาศักดิ์ศรีสำนัก';
      }
    } else if(ev.kind==='DOCTRINE_SUMMIT') {
      if(choice==='ATTEND' && W.sect.stones>=ev.demandStones) {
        ECO.pay(W,ev.demandStones,'ส่งคณะศิษย์ร่วมชุมนุมมรรคากับ'+s.nameTh);
        stonesDelta=-ev.demandStones; deltaAtt=9; outcome='ATTENDED';
        W.fame(2);
        W.npcs.filter(n=>!n.dead&&!n.away&&n.cult).slice(0,3).forEach(n=>{
          CULT.gain(n,18*(1+n.cult.stage*0.15));
          n.h.state.heartDemon=Math.max(0,(n.h.state.heartDemon||0)-8);
        });
        summaryTh='เข้าร่วมชุมนุมมรรคากับ'+s.nameTh+' ศิษย์หลักตบะก้าวหน้า';
      } else {
        deltaAtt=-2; outcome='SKIPPED';
        summaryTh='งดส่งตัวแทนร่วมชุมนุมมรรคากับ'+s.nameTh;
      }
    } else {
      // BORDER_HERB_DISPUTE
      if(choice==='ASSERT') {
        ECO.add(W,ev.specialtyMatId,ev.specialtyQty);
        matAdded=ev.specialtyQty; deltaAtt=-7; outcome='ASSERTED';
        W.fame(1.5);
        summaryTh='แสดงกำลังคุ้มครองแหล่ง '+ECO.name(ev.specialtyMatId)+' ได้รับ ×'+ev.specialtyQty;
      } else {
        const shareQty=Math.max(1,ev.specialtyQty-1);
        ECO.add(W,ev.specialtyMatId,shareQty);
        matAdded=shareQty; deltaAtt=6; outcome='COMPROMISED';
        summaryTh='ตกลงแบ่งปันแหล่ง '+ECO.name(ev.specialtyMatId)+' กับ'+s.nameTh+' ได้รับ ×'+shareQty;
      }
    }
    if(s) {
      s.attitude=clamp(s.attitude+deltaAtt,-100,100);
      s.contact=W.day;
    }
    ev.resolved=true;
    pol.activeEvent=null;
    pol.stats.crisesResolved++;
    pol.events.push({day:W.day,kind:ev.kind,sectId:s?s.id:null,treaty:s?s.treaty:'NONE',outcome,summaryTh,stonesDelta,matAdded});
    if(pol.events.length>40) pol.events.splice(0,pol.events.length-40);
    W.log('mission',summaryTh,lead?[lead.id]:[]);
    return {ok:true,kind:ev.kind,outcome,deltaAtt,stonesDelta,matAdded,summaryTh};
  };

  C.tickPolitics=W=>{
    C.ensure(W);
    const pol=W.world.politics;
    const minReserve=(W.sect.reserveDirectives && W.sect.reserveDirectives.minStoneReserve)||120;
    // 1. Update treaty expirations & automatic embargo thresholds
    (W.world.sects||[]).forEach(s=>{
      const tr=pol.treaties[s.id];
      if(tr && tr.expiresDay && W.day>=tr.expiresDay) {
        delete pol.treaties[s.id];
        if(s.treaty===tr.type) s.treaty='NONE';
      }
      if(s.attitude<=-60 && s.treaty!=='EMBARGO') {
        s.treaty='EMBARGO';
        pol.treaties[s.id]={type:'EMBARGO',signedDay:W.day,expiresDay:W.day+60};
      } else if(s.attitude>-35 && s.treaty==='EMBARGO') {
        s.treaty='NONE';
        delete pol.treaties[s.id];
      }
    });
    // 1b. Every 30 days, if relations are high and treasury has surplus, formalize treaties
    if(W.day>0 && W.day%30===0 && W.sect.stones>=minReserve+100) {
      for(const s of (W.world.sects||[])) {
        if(s.attitude>=45 && s.treaty!=='ALLIANCE' && W.sect.stones>=minReserve+120) {
          C.signTreaty(W,s,'ALLIANCE'); break;
        } else if(s.attitude>=20 && s.treaty==='NONE' && W.sect.stones>=minReserve+80) {
          C.signTreaty(W,s,s.treatyPref==='NON_AGGRESSION'?'NON_AGGRESSION':'TRADE_PACT'); break;
        }
      }
    }
    // 2. Every 10 days, active TRADE_PACT / ALLIANCE partners deliver specialty materials
    if(W.day>0 && W.day%10===0) {
      (W.world.sects||[]).forEach((s,idx)=>{
        if(s.treaty!=='TRADE_PACT' && s.treaty!=='ALLIANCE') return;
        if(!Array.isArray(s.specialtyMatIds)||!s.specialtyMatIds.length) return;
        const matId=s.specialtyMatIds[(W.day+idx)%s.specialtyMatIds.length];
        const shipCost=12;
        if(W.sect.stones>=minReserve+shipCost) {
          ECO.pay(W,shipCost,'รับขบวนสินค้าตามสัญญาการค้าจาก'+s.shortTh);
          ECO.add(W,matId,2);
          pol.stats.tradeShipments++;
        }
      });
    }
    // 3. Resolve or spawn bounded political events
    if(pol.activeEvent) {
      const ev=pol.activeEvent;
      const master=W.byId[W.sect.masterId];
      const canSpend=W.sect.stones>=minReserve+(ev.demandStones||25);
      if(W.day>=ev.expiresDay || canSpend) {
        if(ev.kind==='SPECIALTY_CARAVAN') C.resolvePoliticalEvent(W,canSpend?'ACCEPT':'DECLINE',master);
        else if(ev.kind==='DOCTRINE_SUMMIT') C.resolvePoliticalEvent(W,canSpend?'ATTEND':'SKIP',master);
        else if(ev.kind==='TRIBUTE_DEMAND') {
          const dip=master?(HC.eff(master,'social.charisma')*0.5+(master.h.skills.diplomacy||0)*0.6):40;
          C.resolvePoliticalEvent(W,dip>=45?'PARLEY':(canSpend && HC.eff(master,'personality.caution')>60?'PAY':'DEFY'),master);
        } else {
          C.resolvePoliticalEvent(W,master && HC.eff(master,'personality.aggression')>62?'ASSERT':'COMPROMISE',master);
        }
      }
    } else if(W.day>0 && W.day%18===0) {
      C.spawnPoliticalEvent(W);
    }
  };

  /* ---------- Regional Sites & Expeditions ---------- */
  C.site=(W,reg)=>{
    C.ensure(W); let s=W.world.contentSites[reg.id];
    if(!s) s=W.world.contentSites[reg.id]={day:W.day,stock:Object.fromEntries(reg.resources.map(r=>[r.id,r.cap])),visits:0};
    const elapsed=Math.max(0,W.day-s.day);
    if(elapsed>0) {
      reg.resources.forEach(r=>{s.stock[r.id]=Math.min(r.cap,(s.stock[r.id] || 0)+elapsed*r.regen);});
      s.day=W.day;
    }
    return s;
  };
  C.takeResource=(W,reg,id,quantity)=>{
    if(!Number.isSafeInteger(quantity)||quantity<=0) return 0;
    if(!reg.resources.some(r=>r.id===id)) return 0;
    const s=C.site(W,reg), q=Math.min(quantity,Math.floor(s.stock[id]||0));
    s.stock[id]-=q; return q;
  };
  // New destinations share the existing volunteer/depart/travel/return flow.
  X.REGIONS.push(...D.regions);
  C.chooseRegion=(W,party,kind,regs)=>{
    const lead=party[0], power=party.reduce((v,n)=>v+CULT.power(n),0), caution=HC.eff(lead,'personality.caution');
    const eligible=regs.filter(r=>(!r.minPower || power>=r.minPower) && (!regionById[r.id] || !['hunt','gather'].includes(kind) || r.resources.some(e=>e.kind===(kind==='hunt'?'hunt':'gather'))));
    if(!eligible.length) return null;
    return W.rng.weighted(eligible,r=>{
      if(!regionById[r.id]) return 1;
      const pool=r.resources.filter(e=>e.kind===(kind==='hunt'?'hunt':'gather'));
      const s=C.site(W,r);
      const demand=pool.reduce((v,e)=>v+CPE.scarcity(W,e.id)*Math.min(1,(s.stock[e.id]||0)/Math.max(1,e.cap/3)),0)/Math.max(1,pool.length);
      const interest=kind==='hunt'?HC.eff(lead,'interests.combat'):(HC.eff(lead,'interests.herbs')+HC.eff(lead,'interests.exploring'))/2;
      const discovery=r.recipes.some(id=>!C.formulaInWorld(W,id))||r.techniques.some(id=>!W.sect.library.includes(id));
      return Math.max(.05,(.5+demand)*(0.5+interest/100)*(kind==='fortune'&&discovery?1.6:1)*(1-caution/170*r.danger/4));
    });
  };
  C.gather=(W,ex,alive,out,reg,kind,beast)=>{
    const pool=reg.resources.filter(r=>r.kind===kind && (!beast || beast.drops.includes(r.id)) && C.site(W,reg).stock[r.id]>=1);
    if(!pool.length) {ex.journal.push('แหล่งทรัพยากรกำลังฟื้นตัว จึงไม่ได้เก็บเพิ่ม');return false;}
    const r=W.rng.weighted(pool,r=>r.weight*CPE.scarcity(W,r.id));
    const skill=kind==='hunt'?'survival':ECO.matById[r.id].category==='ORE'?'mining':'herbalism';
    const best=Math.max(...alive.map(n=>n.h.skills[skill]||0));
    const life=g.MARTIAL?Math.max(...alive.map(n=>g.MARTIAL.lifeMult(n,kind==='hunt'?'hunting':skill))):1;
    const quantity=C.takeResource(W,reg,r.id,Math.round((1+Math.floor(best/55)+W.rng.int(0,1))*life));
    if(!quantity) return false;
    out.mats[r.id]=(out.mats[r.id]||0)+quantity;
    C.ensure(W)[kind==='hunt'?'hunted':'gathered']+=quantity;
    ex.journal.push((kind==='hunt'?'เก็บชิ้นส่วนอสูร ':'เก็บ ')+ECO.name(r.id)+' ×'+quantity);
    if(kind==='hunt' && beast) {
      C.harvestOrgan(W,ex,alive,out,reg,beast);
    }
    alive.forEach(n=>(g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(n,skill,.5,1));return true;
  };
  C.discover=(W,ex,alive,out,reg)=>{
    out.recipes=out.recipes||[];
    const recipes=reg.recipes.filter(id=>!C.formulaInWorld(W,id,out));
    const techs=reg.techniques.filter(id=>!W.sect.library.includes(id)&&!out.techs.includes(id)&&!alive.some(n=>(n.inv.techs||[]).includes(id)));
    const scholar=Math.max(...alive.map(n=>HC.eff(n,'intellect.perceptiveness')+(n.h.skills.SCRIPTURE||0)*.25));
    const p=clamp(.20+scholar/400+(ex.kind==='fortune'?.12:0),.20,.65);
    if(recipes.length && W.rng.chance(p)) {
      const id=W.rng.pick(recipes);out.recipes.push(id);ex.journal.push('พบม้วนตำรับ '+ECO.recipeById[id].nameTh);
    }
    // Rare martial knowledge uses the same daily budget and odds as native ruins/caves.
    const extra=JD.MARTIAL.techniques.filter(t=>reg.techniques.some(id=>CULT.tech(id).path===t.path)).map(t=>t.id);
    const drop=g.MARTIAL.discover(W,out,{tier:Math.max(2,reg.danger+2),techs:reg.techniques.concat(extra),source:'region'});
    if(drop) ex.journal.push('พบองค์ความรู้หายาก');
  };
  C.fortune=(W,ex,alive,out,reg)=>{
    if(!regionById[reg.id]) return false;
    if(W.rng.chance(.55)) C.discover(W,ex,alive,out,reg);
    else C.gather(W,ex,alive,out,reg,'gather');
    out.rep+=.2;return true;
  };
  C.complete=(W,ex,alive,out,reg)=>{
    if(!regionById[reg.id]) return;
    C.site(W,reg).visits++;
    C.ensure(W).expeditions++;
    if(alive.length) C.discover(W,ex,alive,out,reg);
  };

  C.pickFormulaHolder=(W,alive,id)=>{
    if(!alive||!alive.length) return null;
    if(alive.length===1) return alive[0];
    const r=ECO.recipeById[id];
    const craftSkill=r?r.craft:'ALCHEMY';
    return W.rng.weighted(alive,a=>1+Math.max(0,(a.h.skills[craftSkill]||0)/40)+clamp((HC.eff(a,'values.wealthResource')+(100-HC.eff(a,'personality.integrity')))/80,0,2));
  };
  C.shouldKeepFormula=(W,holder,id,ex)=>{
    if(!holder) return false;
    if(ex && typeof ex.keepRecipes==='boolean') return ex.keepRecipes;
    if(holder.id===W.sect.masterId || holder.rank>=5) return false;
    const honesty=HC.eff(holder,'personality.integrity'), loyalty=HC.eff(holder,'personality.loyalty'), wealth=HC.eff(holder,'values.wealthResource');
    const craftInt=Math.max(HC.eff(holder,'interests.alchemy'),HC.eff(holder,'interests.forging'));
    const strictness=(W.sect.policy && W.sect.policy.strictness)||50;
    const desire=clamp((wealth+(100-honesty)+(100-loyalty)+Math.max(0,craftInt-55))/4-36,0,50);
    if(desire<=4) return false;
    const keepProb=clamp(desire/145,0,0.42)*(strictness>70?0.5:1);
    return W.rng.chance(keepProb);
  };

  // One handover receipt travels with the expedition and survives save/load.
  const handover=X.handover;
  X.handover=(W,ex,alive,out)=>{
    if(ex.settlement && ex.settlement.state==='settled') return ex.settlement.accepted;
    if(out.settlement && out.settlement.state==='settled') return out.settlement.accepted;
    if(!alive||!alive.length) return handover(W,ex,alive,out);
    C.ensure(W);
    const accepted=handover(W,ex,alive,out), known=W.sect.knownRecipes;
    let reward=0; accepted.recipes=[]; accepted.keptRecipes=[]; accepted.organs={};
    for(const id of new Set(out.recipes||[])) {
      if(!recipeIds.has(id)) continue;
      if(known.includes(id)) continue; // duplicate discovery/handover pays 0 CP
      const holder=C.pickFormulaHolder(W,alive,id);
      if(C.shouldKeepFormula(W,holder,id,ex)) {
        holder.inv.recipes=holder.inv.recipes||[];
        if(!holder.inv.recipes.includes(id)) holder.inv.recipes.push(id);
        accepted.keptRecipes.push({id,npcId:holder.id});
        W.world.contentMetrics.formulasKept++;
        out.notes=out.notes||[];
        out.notes.push(holder.h.name.given+' เก็บม้วนตำรับ「'+ECO.recipeById[id].nameTh+'」ไว้กับตัว');
      } else {
        known.push(id);accepted.recipes.push(id);reward+=C.recipeReward(W,id);
        alive.forEach(n=>C.grantRecipeAuth(W,n,id));
        W.world.contentMetrics.formulas++;
        W.world.contentMetrics.formulasDonated++;
        W.log('research','ม้วนตำรับ「'+ECO.recipeById[id].nameTh+'」เข้าสู่หอคัมภีร์',alive.map(n=>n.id));
      }
    }
    if(out.organs && typeof out.organs==='object') {
      Object.keys(out.organs).forEach(oid=>{
        const qty=out.organs[oid]||0;
        const org=organById[oid];
        if(!org||qty<=0) return;
        C.addOrgan(W,oid,qty);
        accepted.organs[oid]=(accepted.organs[oid]||0)+qty;
        reward+=10*(org.tier||1)*qty;
        W.world.contentMetrics.organsDonated+=qty;
      });
    }
    if(reward) {alive.forEach(n=>CPE.mint(W,n,reward/alive.length,'บริจาคตำรับ/อวัยวะพิเศษใหม่',true));CPE.S(W).donated+=reward;}
    W.world.contentMetrics.manuals+=(accepted.techs||[]).filter(id=>techIds.has(id)).length;
    const receipt={state:'settled',accepted};ex.settlement=receipt;out.settlement=receipt;
    W.world.contentHistory.push({day:W.day,region:ex.region,party:alive.map(n=>n.id),mats:Object.assign({},accepted.mats),organs:Object.assign({},accepted.organs),recipes:accepted.recipes.slice(),keptRecipes:accepted.keptRecipes.map(x=>x.id),techs:(accepted.techs||[]).slice()});
    if(W.world.contentHistory.length>60) W.world.contentHistory.splice(0,W.world.contentHistory.length-60);
    return accepted;
  };

  /* ---------- Hook Diplomacy & Raids for Factions/World Politics ---------- */
  const origDiplomacyResult=X.diplomacyResult;
  X.diplomacyResult=(W,ex,alive,out)=>{
    C.ensure(W);
    origDiplomacyResult(W,ex,alive,out);
    if(!alive||!alive.length) return;
    const contacted=W.world.sects.filter(s=>s.contact===W.day)[0] || W.world.sects.slice().sort((a,b)=>b.attitude-a.attitude)[0];
    if(!contacted) return;
    const minReserve=(W.sect.reserveDirectives && W.sect.reserveDirectives.minStoneReserve)||120;
    if(contacted.attitude>=45 && contacted.treaty!=='ALLIANCE' && W.sect.stones>=minReserve+80) {
      C.signTreaty(W,contacted,'ALLIANCE',{quiet:true});
      ex.journal.push('บรรลุข้อตกลง「พันธมิตรยุทธภพ」กับ'+contacted.nameTh);
    } else if(contacted.attitude>=18 && contacted.treaty==='NONE' && W.sect.stones>=minReserve+40) {
      const pref=contacted.treatyPref==='NON_AGGRESSION'?'NON_AGGRESSION':'TRADE_PACT';
      C.signTreaty(W,contacted,pref,{quiet:true});
      ex.journal.push('ลงนาม「'+TREATY_TH[pref]+'」กับ'+contacted.nameTh);
    }
    if(contacted.attitude>=15 && Array.isArray(contacted.specialtyMatIds) && contacted.specialtyMatIds.length) {
      const giftMat=contacted.specialtyMatIds[0];
      out.mats[giftMat]=(out.mats[giftMat]||0)+1;
      ex.journal.push('ได้รับของขวัญไมตรี '+ECO.name(giftMat)+' ×1');
    }
  };

  const origRaidChance=X.raidChance;
  X.raidChance=W=>{
    C.ensure(W);
    const base=origRaidChance(W);
    let mod=0;
    (W.world.sects||[]).forEach(s=>{
      if(s.treaty==='ALLIANCE' || s.treaty==='NON_AGGRESSION') mod-=0.0015;
      else if(s.treaty==='EMBARGO') mod+=0.0025;
    });
    return clamp(base+mod,0,0.06);
  };

  const origSpawnRaid=X.spawnRaid;
  X.spawnRaid=(W,kind,strength)=>{
    C.ensure(W);
    const allies=(W.world.sects||[]).filter(s=>s.treaty==='ALLIANCE');
    const adjStrength=allies.length ? (strength||0.45)*Math.max(0.72,1-allies.length*0.10) : strength;
    const f=origSpawnRaid(W,kind,adjStrength);
    if(f && allies.length) {
      W.world.politics.stats.jointDefenses++;
      W.log('raid','🛡️ พันธมิตรจาก'+allies[0].shortTh+'ส่งกำลังหนุนช่วยสกัดกั้นข้าศึกที่ชายแดน!',[]);
    }
    return f;
  };

  /* ---------- Hook Native Crafting for Recipe Authorization, Fees & Experiment Synergies ---------- */
  const origFinishCraft=ECO.finishCraft;
  ECO.finishCraft=(W,npc,r,ctx)=>{
    const out=origFinishCraft(W,npc,r,ctx);
    if(!out||!out.ok||!r) return out;
    const syn=C.recipeSynergy(W,r.id);
    if(!syn) return out;
    if(syn.qualityBonus) {
      out.q=Math.round(clamp((out.q||1)+syn.qualityBonus,0.7,1.75)*100)/100;
    }
    if(r.outType==='PILL' && syn.yieldBonus) {
      const key=out.key||(r.outItemId?r.outItemId:'P:'+r.id);
      ECO.add(W,key,syn.yieldBonus);
      out.n=(out.n||1)+syn.yieldBonus;
      out.text=ECO.name(key)+' ×'+out.n;
      out.synergyApplied=true;
    } else if(r.outType==='EQUIPMENT' && out.gear) {
      out.gear.q=out.q;
      if(syn.combatMultBonus) out.gear.combatMult=(out.gear.combatMult||0)+syn.combatMultBonus;
      if(syn.defenseMultBonus) out.gear.defMult=(out.gear.defMult||0)+syn.defenseMultBonus;
      out.text=out.gear.nameTh+' (คุณภาพ '+out.gear.q+')';
      out.synergyApplied=true;
    }
    return out;
  };

  ['brew','forge'].forEach(actId=>{
    const act=AI.ACTS[actId];
    if(!act) return;
    const hall=actId==='brew'?'alchemy':'forge';
    const oCan=act.can, oStart=act.start;
    act.can=function(n,W){
      if(!oCan.apply(this,arguments)) return false;
      const o=W.sect.orders && W.sect.orders[hall];
      const r=o && ECO.recipeById[o.rid];
      if(!r || !r.discoverable) return true;
      return C.isRecipeAuthorized(W,n,r.id) || (C.canAuthorizeRecipe(W,n,r) && (n.cp||0)>=C.recipeFee(W,r,n));
    };
    act.start=function(n,W,ctx){
      const r=ctx && ECO.recipeById[ctx.rid];
      if(!r || !ECO.craftEligible(W,n,r,hall) || (n.h.skills[r.craft]||0)+20<r.minMastery) return false;
      if(!(ctx && ctx.craftReceipt) && !ECO.inputsOk(W,r,1)) return false;
      if(r.discoverable && !C.isRecipeAuthorized(W,n,r.id)) {
        const auth=C.authorizeRecipe(W,n,r.id);
        if(!auth.ok) return false;
      }
      return oStart.apply(this,arguments);
    };
  });

  const reward=CPE.reward;
  CPE.reward=(W,id,n,before)=>{
    if(!ECO.matById[id]||!ECO.matById[id].sourcePack) return reward(W,id,n,before);
    const stock=before==null?ECO.count(W,id):before, target=CPE.target(W,id);
    // Physical oversupply has diminishing donation value, independent of CP price.
    const quantity=n==null?1:n;if(!Number.isSafeInteger(quantity)||quantity<=0) return 0;
    let total=0;for(let i=0;i<quantity;i++) {
      const ratio=(target+2)/(stock+i+2);
      total+=ECO.base(id)*.22*clamp(ratio,0,2.5);
    }
    return total;
  };
  const pickOrder=ECO.pickOrder;
  ECO.pickOrder=(W,hall,head)=>{
    const o=pickOrder(W,hall,head);
    // Region discoveries remain regional resources rather than unlimited imports.
    Object.keys(o.want).forEach(id=>{if(ECO.matById[id]&&ECO.matById[id].sourcePack) delete o.want[id];});
    return o;
  };
  // Premium medicines use the existing personal inventory; they are not added
  // to the free basic-welfare lists. Different path affinities remain meaningful.
  const autoUse=CPE.autoUse;
  C.pillAllowed=(n,key)=>{const i=ECO.pillInfo(key),p=i&&i.effect.compatiblePath;return !!i && (!p || (n.cult && n.cult.path===p));};
  CPE.autoUse=(W,n)=>{
    const count=()=>Object.values((n.inv&&n.inv.pills)||{}).reduce((v,x)=>v+x,0),before=count();
    autoUse(W,n);
    if(count()!==before || n.dead || !n.inv || (n.act&&n.act.id==='fight')) return;
    for(const r of premiumPills) {
      const key='P:'+r.id,e=r.effect;
      if((n.inv.pills[key]||0)<=0 || !C.pillAllowed(n,key)) continue;
      const needs=(e.healHealth && n.h.state.hp<CULT.hpMax(n)*.65) || (e.healInjury && n.inj&&n.inj.length) || (e.clearToxic&&n.cult&&n.cult.toxic>25) || (e.qiRestore&&n.cult&&n.h.state.qi<CULT.qiMax(n)*.3);
      if(needs) {n.inv.pills[key]--;if(!n.inv.pills[key])delete n.inv.pills[key];ECO.applyPill(W,n,key);return;}
    }
  };

  /* ---------- Autonomous Daily Formula Scroll Circulation, Experiments & Politics ---------- */
  C.daily=W=>{
    C.ensure(W);
    D.regions.forEach(r=>C.site(W,r));
    ECO.pruneCraftTransactions(W);
    C.tickPolitics(W);
    // Members holding personal formula scrolls may copy, trade to crafters, or donate them.
    for(const holder of W.npcs) {
      if(!holder || holder.dead || holder.away || !holder.inv) continue;
      if(holder.inv.organs && typeof holder.inv.organs==='object') {
        for(const oid of Object.keys(holder.inv.organs)) {
          if((holder.inv.organs[oid]||0)>0 && (HC.eff(holder,'personality.loyalty')>52 || holder.rank>=3)) {
            C.donateOrgan(W,holder,oid,holder.inv.organs[oid],{quiet:true});
          }
        }
      }
      if(!Array.isArray(holder.inv.recipes) || !holder.inv.recipes.length) continue;
      for(const id of holder.inv.recipes.slice()) {
        const r=ECO.recipeById[id];
        if(!r) continue;
        const skill=holder.h.skills[r.craft]||0;
        if(skill>=Math.max(10,r.minMastery-20) && !C.isRecipeAuthorized(W,holder,id)) {
          C.authorizeRecipe(W,holder,id);
        }
        const price=C.recipeTradePrice(W,id);
        if(!W.sect.knownRecipes.includes(id)) {
          const buyer=W.npcs.find(b=>b!==holder && !b.dead && !b.away && ((b.post===(r.craft==='ALCHEMY'?'alchemy':'forge')) || (b.h.skills[r.craft]||0)>=r.minMastery-10) && (b.inv.stones||0)>=price*1.5 && !(b.inv.recipes||[]).includes(id));
          if(buyer && HC.eff(holder,'values.wealthResource')>62 && W.rng.chance(0.35)) {
            if(skill>=15 && (holder.inv.stones||0)>=8*(r.tier||1)) C.copyRecipe(W,holder,id);
            C.tradeRecipe(W,holder,buyer,id,price);
            continue;
          }
          if((HC.eff(holder,'personality.loyalty')>55 || holder.post || holder.rank>=3) && W.rng.chance(0.45)) {
            C.donateRecipe(W,holder,id);
          }
        } else {
          // Already in sect library: holder turns in redundant scroll for 0 CP.
          C.donateRecipe(W,holder,id,{quiet:true});
        }
      }
    }
    // Autonomous property experimentation & organ refinement when surplus exists
    const minReserve=(W.sect.reserveDirectives && W.sect.reserveDirectives.minStoneReserve)||120;
    if(W.day>0 && W.day%5===0 && W.sect.stones>=minReserve+40) {
      for(const exp of experiments) {
        if(W.sect.experiments.discovered.includes(exp.id)) continue;
        // Only experiment when trial inputs have surplus (>= count + 2)
        if(!exp.trialInputs.every(i=>ECO.count(W,i.matId)>=i.count+2)) continue;
        const researcher=W.npcs.find(n=>!n.dead && !n.away && C.canRunExperiment(W,n,exp).ok);
        if(researcher) {
          C.runExperiment(W,researcher,exp,{useCatalyst:C.organCount(W,exp.catalystOrganId)>1});
          break;
        }
      }
    }
    if(W.day>0 && W.day%7===0 && W.sect.stones>=minReserve+50) {
      for(const org of rareOrgans) {
        if(C.organCount(W,org.id)<2) continue; // Keep at least 1 organ for experiment catalyst
        const target=W.npcs.find(n=>!n.dead && !n.away && n.cult && (n.cult.bn || (n.inj&&n.inj.length) || (n.cult.toxic||0)>20 || (n.h.state.heartDemon||0)>20));
        if(target) {
          C.refineOrgan(W,target,org.id);
          break;
        }
      }
    }
  };

  C.validate=()=>{
    const errors=[], unique=(list,kind)=>{const ids=new Set();list.forEach(x=>{if(ids.has(x.id))errors.push('duplicate '+kind+' '+x.id);ids.add(x.id);});};
    unique(g.JD.ITEMS.materials,'material');unique(g.JD.ITEMS.recipes,'recipe');unique(g.JD.TECH.techniques,'technique');unique(X.REGIONS,'region');unique(g.JD.BEASTS.species,'beast');
    unique(rareOrgans,'rareOrgan');unique(experiments,'experiment');unique(factions,'faction');
    D.subPaths.forEach(s=>{if(!g.JD.CULT.paths[s.path]||!g.JD.CULT.paths[s.path].subPaths.some(p=>p.id===s.id)) errors.push('missing subpath '+s.id);});
    D.materials.forEach(m=>{if(!Number.isFinite(m.value)||m.value<=0||!Number.isInteger(m.tier)||m.tier<1) errors.push('invalid material '+m.id);if(!D.regions.some(r=>r.resources.some(e=>e.id===m.id)))errors.push('unobtainable '+m.id);});
    D.recipes.forEach(r=>{
      if(!['ALCHEMY','FORGING','ARRAY','TALISMAN'].includes(r.craft)) errors.push('unsupported craft '+r.id);
      if(!['PILL','EQUIPMENT'].includes(r.outType)) errors.push('unsupported output '+r.id);
      for(const k of ['tier','minMastery','yield','facilityLevel'])if(!Number.isFinite(r[k])||r[k]<0) errors.push('invalid '+k+' '+r.id);
      r.inputs.forEach(i=>{if(!ECO.matById[i.matId]||!Number.isSafeInteger(i.count)||i.count<=0)errors.push('bad input '+r.id+' '+i.matId);});
      if(!D.regions.some(reg=>reg.recipes.includes(r.id)))errors.push('undiscoverable recipe '+r.id);
    });
    D.techniques.forEach(t=>{const p=CULT.PATHS[t.path];if(!p||!p.subPaths.some(s=>s.id===t.sub)||!Number.isInteger(t.reqTier)||t.reqTier<1||t.reqTier>p.maxStage||!g.SK.ARCH[t.combatArch]||!g.SK.profile(t))errors.push('invalid technique '+t.id);if(!D.regions.some(r=>r.techniques.includes(t.id)))errors.push('undiscoverable technique '+t.id);});
    D.beasts.forEach(b=>{if(!Number.isFinite(b.cp)||b.cp<=0||!b.drops.length||b.drops.some(id=>!ECO.matById[id]))errors.push('invalid beast '+b.id);});
    D.regions.forEach(r=>{
      if((r.beasts||[]).some(id=>!g.JD.BEASTS.species.some(b=>b.id===id)))errors.push('bad encounter '+r.id);
      if(!Number.isFinite(r.days)||r.days<=0||!Number.isFinite(r.minPower)||r.minPower<0) errors.push('invalid region '+r.id);
      r.resources.forEach(e=>{if(!ECO.matById[e.id]||!Number.isInteger(e.cap)||e.cap<=0||!Number.isFinite(e.regen)||e.regen<=0||!['hunt','gather'].includes(e.kind))errors.push('bad region resource '+r.id+' '+e.id);});
      r.recipes.forEach(id=>{if(!recipeIds.has(id))errors.push('bad formula '+id);});r.techniques.forEach(id=>{if(!techIds.has(id))errors.push('bad manual '+id);});
    });
    rareOrgans.forEach(o=>{
      if(!o.nameTh||!Number.isInteger(o.tier)||o.tier<1||!g.JD.BEASTS.species.some(b=>b.id===o.beastId)||!regionById[o.regionId]) errors.push('invalid rareOrgan '+o.id);
    });
    experiments.forEach(e=>{
      if(!e.nameTh||!recipeIds.has(e.linkedRecipeId)||!organById[e.catalystOrganId]||!Array.isArray(e.trialInputs)||!e.trialInputs.length) errors.push('invalid experiment '+e.id);
      e.trialInputs.forEach(i=>{if(!ECO.matById[i.matId]||!Number.isSafeInteger(i.count)||i.count<=0) errors.push('bad experiment input '+e.id+' '+i.matId);});
    });
    factions.forEach(f=>{
      if(!f.nameTh||!Array.isArray(f.specialtyMatIds)||!f.specialtyMatIds.length||f.specialtyMatIds.some(id=>!ECO.matById[id])) errors.push('invalid faction '+f.id);
    });
    return errors;
  };
  g.CONTENT=C;
  if(typeof module==='object'&&module.exports) module.exports=C;
})(typeof globalThis!=='undefined'?globalThis:this);
