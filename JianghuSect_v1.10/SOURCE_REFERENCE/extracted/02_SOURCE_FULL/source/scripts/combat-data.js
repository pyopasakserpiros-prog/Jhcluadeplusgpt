/* Living Combat 1.17. Declarative route contracts and original milestone arts.
   Identity remains in HumanCore; these are learned abilities, not new identity axes. */
(function(root){'use strict';
const E=root.World2026Engine,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// start / final capacity, tactical discipline, optional innate technique and category.
// Register 6 Hidden World-Discovered Subpaths into E.CULTIVATION_PATHS
const HIDDEN_SUBPATHS_V210=[
 ['XIAN','STAR_SWORD_ASTROLOGY','เซียนดารากระบี่พยากรณ์',1.06],
 ['XIAN','MIST_LOTUS_ALCHEMY','เซียนบัวหมอกพิษโอสถ',1.04],
 ['BODY','DRAGON_PULSE_SOVEREIGN','กายาชีพจรมังกรปฐพี',1.07],
 ['GOD','CELESTIAL_THUNDER_EDICT','เทพบัญชาอัสนีสวรรค์',1.07],
 ['DEMON','ABYSSAL_MIRROR_ECLIPSE','มารกระจกสุริยุปราคา',1.05],
 ['HEART_SOUL','VOID_LUTE_SOUL_WEAVER','จิตพิณสุญตาร้อยวิญญาณ',1.05]
];
for(const [pKey,subKey,nameTh,cBonus] of HIDDEN_SUBPATHS_V210){
 const pObj=E.CULTIVATION_PATHS?.[pKey];
 if(pObj&&pObj.subPaths&&!pObj.subPaths[subKey]){
  const templateSub=Object.values(pObj.subPaths)[0];
  pObj.subPaths[subKey]={
   ...JSON.parse(JSON.stringify(templateSub)),
   id:subKey,
   nameTh,
   combatBonus:cBonus,
   hiddenWorldSubpath:true
  };
 }
}
// A subpath label alone is insufficient: the cultivation resolver and project
// lifecycle dispatch through the expansion's private track/realm registries.
// Inherit a coherent existing realm schedule, with independent route IDs, so
// hidden inheritances retain their identity through advancement and saving.
const hiddenTrackBases={STAR_SWORD_ASTROLOGY:'SWORD_IMMORTAL',MIST_LOTUS_ALCHEMY:'ELIXIR_DAO',DRAGON_PULSE_SOVEREIGN:'TIGER_SOVEREIGN',CELESTIAL_THUNDER_EDICT:'THUNDER_PUNISHER_GOD',ABYSSAL_MIRROR_ECLIPSE:'SHADOW_ASSASSIN',VOID_LUTE_SOUL_WEAVER:'ZEN_VOID_MIND'};
for(const [major,sub,nameTh] of HIDDEN_SUBPATHS_V210){
 const template=E.getCultivationTrackV1200(major,hiddenTrackBases[sub]);
 if(!template)continue;
 const track=JSON.parse(JSON.stringify(template).split(template.subpathId).join(sub));
 track.nameTh=nameTh;track.nameEn=sub;track.hiddenWorldSubpath=true;track.isCanonical24=false;track.isNewV112=true;
 track.transitions=(template.transitions||template.realms.map(r=>E.getTransitionDefinitionV1200(r.transitionId)).filter(Boolean)).map(t=>JSON.parse(JSON.stringify(t).split(template.subpathId).join(sub)));
 for(const realm of track.realms){realm.nameTh=nameTh+' · '+realm.nameTh;realm.nameEn=sub+' · '+realm.nameEn;}
 for(const t of track.transitions){t.fromNameTh=track.realms[t.fromOrdinal-1]?.nameTh||t.fromNameTh;t.toNameTh=track.realms[t.toOrdinal-1]?.nameTh||t.toNameTh;}
 root.JianghuExpansionV112.registerCultivationTrack(track);
}
const ROWS=[
 ['XIAN','SWORD_IMMORTAL',2,4,'duelist','กระบี่หนึ่งเจตตัดม่านเมฆ','attack'],
 ['XIAN','FIVE_ELEMENTS',2,5,'combo','วงจรห้าธาตุคืนกำเนิด','attack'],
 ['XIAN','ELIXIR_DAO',1,3,'healer','ลมหายใจเตาหยกประคองชีพ','recovery'],
 ['XIAN','ASTRAL_ARRAY',2,5,'controller','ดาราตรึงเขตแปดทิศ','control'],
 ['XIAN','BLOOD_DEMON',1,4,'attrition','ฝ่ามือโลหิตย้อนชีพ','attack'],
 ['XIAN','PHANTOM_SOUL',2,4,'controller','เงาจิตผนึกวิญญาณ','control'],
 ['XIAN','TIME_VOID',1,4,'controller','รอยแยกชั่วพริบตา','movement'],
 ['XIAN','SOUND_ZITHER',3,10,'combo','สายพิณประสานเจ็ดเสียง','attack'],
 ['XIAN','YIN_YANG_HARMONY',2,5,'combo','หยินหยางกลับขั้ว','attack'],
 ['XIAN','SPIRIT_PUPPET_MECHANICA',2,6,'guardian',null,null],
 ['XIAN','CLOUD_WIND_SAGE',2,4,'skirmisher','ท่าร่างลมโอบยอดเมฆ','movement'],
 ['XIAN','FROST_MOON_IMMORTAL',1,4,'controller','บัวจันทราผนึกธารา','attack'],
 ['BODY','TIGER_SOVEREIGN',2,4,'burst','พยัคฆ์สะเทือนขุนเขา','attack'],
 ['BODY','BLOOD_DRAGON',1,4,'attrition','มังกรโลหิตแหวกสมุทร','attack'],
 ['BODY','VAJRA_BODHI',1,3,'guardian','ระฆังโพธิ์สะท้อนคม','defense'],
 ['BODY','DEVOURING_FIEND',1,3,'attrition','เขี้ยวอสูรกลืนปราณ','attack'],
 ['BODY','SOLAR_FORGE',1,3,'burst','เตาสุริยะเก้ารอยหมัด','attack'],
 ['BODY','THUNDER_BODY',2,4,'skirmisher','ชีพจรอัสนีเปิดทาง','attack'],
 ['BODY','JADE_IMMORTAL_BODY',1,3,'guardian','หยกไร้รอยรักษากาย','recovery'],
 ['BODY','TITAN_MOUNTAIN_BODY',1,3,'guardian','มหาศิลาค้ำฟ้า','defense'],
 ['BODY','ABYSSAL_LEVIATHAN_BODY',1,4,'attrition','คลื่นสมุทรกลืนตะวัน','attack'],
 ['BODY','STAR_METEOR_BODY',2,4,'burst','หมัดอุกกาบาตผ่าราตรี','attack'],
 ['BODY','WOOD_SPRING_BODY',1,3,'healer','หน่อไม้ผลิกลางบาดแผล','recovery'],
 ['GOD','WAR_DEITY',2,4,'guardian','ธงสัตย์พิทักษ์สหาย','defense'],
 ['GOD','MERCY_DEITY',1,3,'healer','ฝนเมตตาประสานชีพ','recovery'],
 ['GOD','FATE_ORACLE',2,4,'controller','ลายชะตาเปิดจุดอ่อน','control'],
 ['GOD','TOTEM_BEAST_GOD',2,4,'burst',null,null],
 ['GOD','UNDERWORLD_JUDGE',1,4,'controller','ตรายมโลกตัดเวร','attack'],
 ['GOD','OCEAN_SOVEREIGN',2,4,'controller','คลื่นวนมุกสมุทร','attack'],
 ['GOD','HARVEST_EARTH_GOD',1,3,'healer',null,null],
 ['GOD','HEAVENLY_SCHOLAR_SAGE',2,5,'combo','อักษรสวรรค์จารึกช่องโหว่','control'],
 ['GOD','THUNDER_PUNISHER_GOD',1,4,'burst','บัญชาอัสนีพิพากษา','attack'],
 ['GOD','MEDICINE_BODHI_GOD',1,3,'healer','โคจรปราณบัวโอสถ','mantra'],
 ['DEMON','SHADOW_ASSASSIN',2,4,'skirmisher','เงาเดียวดับโคม','attack'],
 ['DEMON','VENOM_GU_SOVEREIGN',2,5,'attrition','พิษกู่ร้อยชีพจร','attack'],
 ['DEMON','NETHER_GHOST_KING',2,4,'controller','ระฆังวิญญาณคืนเงา','control'],
 ['DEMON','HEAVEN_DEVOURING_DEMON',1,3,'attrition','คัมภีร์กลืนฟ้าร้าวชีพ','forbidden'],
 ['HEART_SOUL','ZEN_VOID_MIND',1,3,'guardian','จิตว่างดั่งกระจกนิ่ง','mantra'],
 ['HEART_SOUL','CALLIGRAPHY_PAINTING_SAGE',3,6,'combo','หมึกแรกเปิดภูผา','attack'],
 ['HEART_SOUL','DREAM_ILLUSION_WEAVER',2,5,'controller','ม่านฝันพันเงา','control'],
 ['HEART_SOUL','MIND_SWORD_TELEKINESIS',2,6,'duelist','หนึ่งจิตกระบี่คืนรัง','attack'],
 ['XIAN','STAR_SWORD_ASTROLOGY',2,5,'combo','ดาราพยากรณ์เจ็ดก้าวกระบี่','attack'],
 ['XIAN','MIST_LOTUS_ALCHEMY',2,4,'attrition','หมอกบัวหยกกลืนพิษ','control'],
 ['BODY','DRAGON_PULSE_SOVEREIGN',1,4,'guardian','ชีพจรมังกรสะเทือนปฐพี','defense'],
 ['GOD','CELESTIAL_THUNDER_EDICT',2,5,'burst','ตราอัสนีสวรรค์พิพากษา','attack'],
 ['DEMON','ABYSSAL_MIRROR_ECLIPSE',2,5,'controller','กระจกเงาสุริยุปราคาสะท้อนจิต','control'],
 ['HEART_SOUL','VOID_LUTE_SOUL_WEAVER',3,7,'combo','พิณสุญตาร้อยด้ายวิญญาณ','attack']
];
const STYLES={
 duelist:{name:'คมเดียวหยั่งช่อง',damage:1.07,qi:1.02,regen:1.02,guard:1,combo:1},
 burst:{name:'ระเบิดพลัง',damage:1.15,qi:1.00,regen:.96,guard:.98,combo:1},
 guardian:{name:'ตั้งรับสวนกลับ',damage:.95,qi:1.02,regen:1.02,guard:1.14,combo:1},
 controller:{name:'ควบคุมจังหวะ',damage:1.02,qi:1.08,regen:1.02,guard:1.02,combo:1.08},
 healer:{name:'ประคองชีพยื้อศึก',damage:.85,qi:1.06,regen:1.06,guard:1,combo:1},
 attrition:{name:'กัดกร่อนทรัพยากร',damage:1.03,qi:1.00,regen:1.02,guard:1.02,combo:1},
 skirmisher:{name:'ชิงจังหวะเคลื่อนหลบ',damage:1.05,qi:1.00,regen:1.05,guard:.98,combo:1},
 combo:{name:'เชื่อมเคล็ดต่อกระบวน',damage:.87,qi:1.10,regen:1.02,guard:.95,combo:1.16}
};
const profiles={},innates=[];
const categories={attack:'COMBAT_TECHNIQUE',control:'COMBAT_TECHNIQUE',defense:'AUXILIARY_ART',recovery:'AUXILIARY_ART',movement:'LIGHTNESS_ART',mantra:'QI_MANTRA',forbidden:'FORBIDDEN_ART'};
for(const [path,sub,start,max,style,name,kind] of ROWS){
 const track=E.getCultivationTrackV1200(path,sub),count=track?.realmCount||9;
 let slots=[[1,start],[Math.max(2,Math.ceil(count*.5)),Math.min(max,start+1)],[Math.ceil(count*.8),max]];
 if(sub==='SWORD_IMMORTAL')slots=[[1,2],[4,3],[8,4]];
 if(sub==='SOUND_ZITHER')slots=[[1,3],[3,5],[5,7],[7,9],[8,10]];
 if(sub==='TITAN_MOUNTAIN_BODY')slots=[[1,1],[4,2],[7,3]];
 const profile=profiles[path+':'+sub]={path,subPath:sub,realmCount:count,slots,style,...STYLES[style],innateIds:[],tradeoffTh:`ช่องโจมตี ${start}–${max} · ${STYLES[style].name} · ใช้ปราณและจังหวะออกท่าร่วมกัน`};
 if(!name)continue;
 const ord=kind==='recovery'||kind==='movement'?2:kind==='forbidden'?5:3,tier=Math.max(1,Math.floor(track?.realms?.[ord-1]?.realizationBand||3));
 const id='ART_C117_INNATE_'+sub;
 const role=kind==='mantra'?null:kind;
 let setup=style==='combo'?'RESONANCE':'OPEN',consume=style==='burst'||style==='duelist'?'OPEN':null;
 if(style==='controller'){setup='BOUND';consume=null;}
 const effects={attack:['EFX_WEAKNESS_EXPOSURE'],control:['EFX_STAGGER'],defense:['EFX_BARRIER_SHIELD','EFX_TIMED_PARRY'],recovery:['EFX_MERIDIAN_TOXIN_PURGE'],movement:['EFX_SIDESTEP_EVASION'],mantra:['EFX_QI_RESERVOIR'],forbidden:['EFX_BLOOD_SACRIFICE_OVERDRIVE']}[kind];
 if(sub==='MERCY_DEITY')effects.push('EFX_MASS_VITAL_HEAL');
 if(style==='attrition')effects.push(sub.includes('VENOM')?'EFX_TOXIN_INFECTION':'EFX_VITALITY_STEAL');
 if(sub==='FROST_MOON_IMMORTAL')effects.push('EFX_CHILL_FREEZE');
 const m={role,qi:kind==='forbidden'?26:kind==='control'?15:kind==='recovery'?16:11+tier,cooldown:kind==='forbidden'?24:kind==='recovery'?13:kind==='defense'?11:6.5,range:kind==='attack'&&path==='BODY'?145:245,damage:role==='control'?.66:1.08,setup:!consume&&(role==='attack'||role==='control')?setup:null,consume,setupSeconds:5,comboMultiplier:1.35,tags:[style,'INNATE'],heal:kind==='recovery'?22:0};
 const art={id,nameTh:name,path,subPath:sub,category:categories[kind],tier,requiredNormalizedTier:tier,power:65+tier*12,costs:{qiCost:m.qi,vitalityCost:kind==='forbidden'?15:0,lifespanCostYears:kind==='forbidden'?1:0},cooldownTurns:3,moves:[name],rangeBand:m.range>180?'MID':'MELEE',effectBindings:effects.map(effectId=>({effectId})),innateRoute:{path,subPath:sub,ordinal:ord},combat117:m,dropWeight:0,canRedistribute:false,loreTh:`วิชาตื่นรู้เฉพาะสาย${E.CULTIVATION_PATHS[path]?.subPaths[sub]?.nameTh||sub} เมื่อบรรลุขอบเขตที่ ${ord} ใช้แยกจากช่องโจมตีทั่วไป ถ่ายทอดเป็นวิชาทั่วไปไม่ได้`};
 profile.innateIds.push(id);innates.push(art);
}
// Later awakenings make milestones genuinely different instead of granting
// every discipline its complete repertoire at one shared stage.
for(const [sub,ordinal,name,kind,setup,consume,effect] of [
 ['SOUND_ZITHER',5,'พิณหวนเก้าเสียงสะท้อนนภา','attack',null,'RESONANCE','EFX_SWORD_STORM_STRIKE'],
 ['FIVE_ELEMENTS',6,'ห้าธาตุผสานคืนวัฏจักร','attack',null,'RESONANCE','EFX_ELEMENTAL_ANNIHILATION'],
 ['SWORD_IMMORTAL',6,'ลมหายใจคมกระบี่ไร้ฝุ่น','mantra',null,null,'EFX_QI_RESERVOIR'],
 ['BLOOD_DRAGON',5,'เผาเกล็ดมังกรแลกหนึ่งชัย','forbidden',null,'OPEN','EFX_BLOOD_SACRIFICE_OVERDRIVE'],
 ['WAR_DEITY',5,'ม่านธงสัตย์คุ้มสหายร่วมศึก','defense',null,null,'EFX_GUARDED_DAMAGE_SHARE'],
 ['FROST_MOON_IMMORTAL',5,'เหยียบจันทราข้ามธารน้ำแข็ง','movement',null,null,'EFX_SIDESTEP_EVASION'],
 ['TIME_VOID',5,'รอยกระบี่คั่นห้วงกาล','attack',null,'BOUND','EFX_WEAKNESS_EXPOSURE'],
 ['CALLIGRAPHY_PAINTING_SAGE',5,'หมึกสุดท้ายปิดผืนสวรรค์','attack',null,'RESONANCE','EFX_SWORD_STORM_STRIKE']
]){
 const p=Object.values(profiles).find(p=>p.subPath===sub),track=E.getCultivationTrackV1200(p.path,sub),tier=Math.floor(track.realms[ordinal-1].realizationBand),id='ART_C117_AWAKENED_'+sub;
 const role=kind==='mantra'?null:kind;
 const a={id,nameTh:name,path:p.path,subPath:sub,tier,requiredNormalizedTier:tier,category:categories[kind],power:85+tier*10,moves:[name],costs:{qiCost:kind==='forbidden'?30:18,vitalityCost:kind==='forbidden'?25:0,lifespanCostYears:kind==='forbidden'?1:0},effectBindings:[{effectId:effect}],innateRoute:{path:p.path,subPath:sub,ordinal},combat117:{role,qi:kind==='forbidden'?30:18,cooldown:kind==='forbidden'?28:kind==='defense'?14:9,range:250,damage:kind==='defense'?.25:1.12,setup,consume,setupSeconds:5,comboMultiplier:1.4,tags:effect.includes('STORM')?['AREA']:[]},dropWeight:0,canRedistribute:false,loreTh:'วิชาตื่นรู้ขั้นสูงประจำสาย ใช้แยกจากช่องโจมตีทั่วไป มีปราณและคูลดาวน์ของตนเอง'};
 innates.push(a);p.innateIds.push(id);
}
// Track synchronization operates on gross lifespan; permanent combat debt is
// deducted once at the boundary, including after a realm changes its ceiling.
const syncIdentity=E.syncNpcCultivationIdentityV1200.bind(E),syncing=new WeakSet();
E.syncNpcCultivationIdentityV1200=function(w,n,opts){
 const actor=typeof n==='string'?w.npcs[n]:n;
 if(!actor?.jianghu||syncing.has(actor))return syncIdentity(w,n,opts);
 const j=actor.jianghu,debt=Math.max(0,Number(j.combatLifespanDebt117)||0);
 if(!debt)return syncIdentity(w,n,opts);
 const before=j.lifespanMax;syncing.add(actor);j.lifespanMax=before+debt;
 try{const result=syncIdentity(w,n,opts);j.lifespanMax=Math.max(Number(actor.age||0)+1,j.lifespanMax-debt);return result;}
 catch(e){j.lifespanMax=before;throw e;}finally{syncing.delete(actor);}
};
// Discussion, meditation and fortunes use the generic gain API, not the training
// action. Keep their canonical track projection current at the write boundary.
const gainProgress=E.applyNpcCultivationProgressGain.bind(E);
E.applyNpcCultivationProgressGain=function(w,n,delta,context){
 const result=gainProgress(w,n,delta,context),actor=typeof n==='string'?w?.npcs?.[n]:n;
 if(actor?.jianghu?.cultivationIdentityV1200)E.syncNpcCultivationIdentityV1200(w,actor,{progress:actor.jianghu.cultivationProgress});
 return result;
};

// 36 New World-Discovered Martial Arts (v2.10) — Never spawn in sect starter pool!
// Must be discovered in Myriad Worlds, Secret Realms, Rumor Spots, or learned from External Envoys/Masters.
const WORLD_DISCOVERED_ARTS_V210_DEFS=[
 // --- 0-Cooldown Rapid Chain / Stance Techniques (ใช้วนต่อเนื่องระหว่างรอคูลดาวน์วิชาหลัก) ---
 ['ART_V210_CHAIN_STAR_SWORD','เพลงกระบี่ดาราไร้รอย (ท่าต่อเนื่องไร้คูลดาวน์)','XIAN','STAR_SWORD_ASTROLOGY',2,'COMBAT_TECHNIQUE','attack',0,4,155,.88,'OPEN',null,'SWORD_INTENT',null,['SWORD','CHAIN'],'EXTERNAL_MASTER','เคล็ดกระบี่ต่อเนื่องที่ใช้ปราณเพียงเล็กน้อยและไร้คูลดาวน์ สะสมเจตกระบี่และเปิดช่องโหว่ศัตรูระหว่างรอท่าใหญ่'],
 ['ART_V210_CHAIN_SWORD_FLOW','คมกระบี่สายน้ำไหลต่อเนื่อง','XIAN','SWORD_IMMORTAL',2,'COMBAT_TECHNIQUE','attack',0,4,150,.86,null,'OPEN','SWORD_INTENT',null,['SWORD','CHAIN'],'SECRET_REALM','กระบวนท่ากระบี่ไร้รอยต่อที่ตวัดซ้ำได้ทันทีตราบเท่าที่มีปราณ'],
 ['ART_V210_CHAIN_ZITHER_PLUCK','ดีดสายพิณสะท้อนจันทร์ (ไร้คูลดาวน์)','XIAN','SOUND_ZITHER',2,'COMBAT_TECHNIQUE','attack',0,4,250,.84,'RESONANCE',null,null,'MERIDIAN_SEAL',['CHAIN'],'EXTERNAL_MASTER','คลื่นเสียงพิณระยะไกลที่ส่งออกได้ต่อเนื่องโดยไม่ติดคูลดาวน์ รบกวนการโคจรปราณของศัตรู'],
 ['ART_V210_CHAIN_DRAGON_FIST','หมัดชีพจรมังกรประสานต่อเนื่อง','BODY','DRAGON_PULSE_SOVEREIGN',2,'COMBAT_TECHNIQUE','attack',0,4,135,.90,'OPEN',null,'IRON_AEGIS','ARMOR_SUNDER',['PIERCE','CHAIN'],'MYRIAD_WORLDS','หมัดสั้นไร้คูลดาวน์ที่ใช้แรงสั่นสะเทือนจากผืนดินกะเทาะเกราะปราณศัตรูทุกครั้งที่ชก'],
 ['ART_V210_CHAIN_TIGER_CLAW','กรงเล็บพยัคฆ์ฉีกสายลม (ไร้คูลดาวน์)','BODY','TIGER_SOVEREIGN',2,'COMBAT_TECHNIQUE','attack',0,4,135,.90,'OPEN',null,null,'ARMOR_SUNDER',['PIERCE','CHAIN'],'RUMOR_HERITAGE','กรงเล็บจู่โจมระยะประชิดที่ออกท่าซ้ำได้ทันทีโดยไม่ต้องรอรอบคูลดาวน์'],
 ['ART_V210_CHAIN_THUNDER_SPEAR','หอกสายฟ้าแลบแปลบปลาบ (ไร้คูลดาวน์)','GOD','CELESTIAL_THUNDER_EDICT',2,'COMBAT_TECHNIQUE','attack',0,4,195,.88,'BOUND',null,'QI_SURGE',null,['PIERCE','CHAIN'],'MYRIAD_WORLDS','คมหอกอัสนีที่แทงซ้ำได้ไม่จำกัดจังหวะ วางตราพันธนาการสายฟ้าไว้รอท่าพิพากษา'],
 ['ART_V210_CHAIN_SHADOW_DAGGER','มีดสั้นเงาจันทร์ซ้อนคม (ไร้คูลดาวน์)','DEMON','SHADOW_ASSASSIN',2,'COMBAT_TECHNIQUE','attack',0,4,145,.89,'OPEN',null,'WIND_STRIDE','MERIDIAN_SEAL',['DOT','CHAIN'],'EXTERNAL_MASTER','เพลงมีดสั้นไร้คูลดาวน์ที่กรีดจุดชีพจรศัตรูพร้อมเร่งฝีเท้าผู้ร่าย'],
 ['ART_V210_CHAIN_VOID_LUTE','ลำนำพิณสุญตาพันด้ายจิต (ไร้คูลดาวน์)','HEART_SOUL','VOID_LUTE_SOUL_WEAVER',2,'COMBAT_TECHNIQUE','attack',0,4,255,.86,'RESONANCE',null,'MIND_MIRROR','SOUL_TREMOR',['CHAIN'],'MYRIAD_WORLDS','เสียงพิณสุญตาที่บรรเลงต่อเนื่องไร้คูลดาวน์ สั่นคลอนดวงจิตศัตรูและทำให้จิตผู้ร่ายสงบนิ่ง'],

 // --- Signature Hidden Subpath Openers, Controllers & Finishers ---
 ['ART_V210_STAR_ASTRO_SEAL','ค่ายกลดาราพยากรณ์ผนึกชะตา','XIAN','STAR_SWORD_ASTROLOGY',3,'COMBAT_TECHNIQUE','control',6.0,10,250,.96,'BOUND','OPEN','MIND_MIRROR','MERIDIAN_SEAL',['SWORD','AREA'],'MYRIAD_WORLDS','อ่านวิถีดาวเพื่อตรึงร่างศัตรูและสกัดจุดชีพจรปราณ'],
 ['ART_V210_STAR_FALL_FINISHER','กระบี่ดาราดับขันธ์ผ่าฟากฟ้า','XIAN','STAR_SWORD_ASTROLOGY',4,'COMBAT_TECHNIQUE','attack',10.5,14,240,1.34,null,'BOUND','SWORD_INTENT','ARMOR_SUNDER',['SWORD','PIERCE'],'SECRET_REALM','ท่าปิดฉากสายเซียนดารากระบี่ที่ระเบิดพลังใส่เป้าหมายที่ถูกตรึงชีพจร'],
 ['ART_V210_LOTUS_MIASMA_CLOUD','ม่านหมอกบัวพิษกลืนปราณ','XIAN','MIST_LOTUS_ALCHEMY',3,'COMBAT_TECHNIQUE','control',5.5,9,230,.92,'OPEN',null,'QI_SURGE','MERIDIAN_SEAL',['DOT','AREA'],'MYRIAD_WORLDS','ปล่อยไอหมอกโอสถพิษกัดกร่อนปราณศัตรูพร้อมฟื้นฟูลมหายใจผู้ร่าย'],
 ['ART_V210_LOTUS_CAULDRON_BURST','เตาหลอมบัวหยกเพลิงพิษประลัย','XIAN','MIST_LOTUS_ALCHEMY',4,'COMBAT_TECHNIQUE','attack',9.0,13,220,1.28,null,'OPEN',null,'ARMOR_SUNDER',['FIRE','DOT'],'EXTERNAL_MASTER','จุดระเบิดไอโอสถในร่างศัตรูที่เปิดช่องป้องกันให้ลุกไหม้จากภายใน'],
 ['ART_V210_DRAGON_EARTH_QUAKE','บาทามังกรปฐพีถล่มขุนเขา','BODY','DRAGON_PULSE_SOVEREIGN',3,'COMBAT_TECHNIQUE','control',6.5,9,175,.98,'BOUND',null,'IRON_AEGIS','ARMOR_SUNDER',['AREA','PIERCE'],'MYRIAD_WORLDS','กระทืบพื้นดึงชีพจรมังกรขึ้นมากระแทกศัตรูจนเสียจังหวะและเกราะร้าว'],
 ['ART_V210_DRAGON_ASCEND_SMITE','หมัดมังกรบรรพกาลทะลวงภพ','BODY','DRAGON_PULSE_SOVEREIGN',5,'COMBAT_TECHNIQUE','attack',11.0,15,165,1.38,null,'BOUND','IRON_AEGIS','ARMOR_SUNDER',['PIERCE'],'SECRET_REALM','รวบรวมแรงสะท้อนจากเกราะปราณและผืนดินซัดเข้าใส่เป้าหมายที่เสียจังหวะอย่างรุนแรง'],
 ['ART_V210_THUNDER_EDICT_LOCK','โซ่อัสนีสวรรค์จองจำมาร','GOD','CELESTIAL_THUNDER_EDICT',3,'COMBAT_TECHNIQUE','control',5.8,10,260,.95,'BOUND',null,'QI_SURGE','MERIDIAN_SEAL',['AREA'],'EXTERNAL_MASTER','อัญเชิญโซ่สายฟ้าจากฟากฟ้าตรึงการเคลื่อนไหวและสกัดจุดปราณศัตรู'],
 ['ART_V210_THUNDER_HEAVEN_WRATH','ทัณฑ์สวรรค์เก้าอัสนีพิพากษา','GOD','CELESTIAL_THUNDER_EDICT',5,'COMBAT_TECHNIQUE','attack',11.5,16,270,1.40,null,'BOUND','QI_SURGE','ARMOR_SUNDER',['AREA','PIERCE'],'MYRIAD_WORLDS','ฟาดสายฟ้าทัณฑ์สวรรค์ลงบนศัตรูที่ติดตราพันธนาการสายฟ้า'],
 ['ART_V210_ECLIPSE_MIRROR_HEX','มนต์กระจกสุริยุปราคาดูดเงา','DEMON','ABYSSAL_MIRROR_ECLIPSE',3,'COMBAT_TECHNIQUE','control',5.5,9,240,.94,'OPEN',null,'BLOOD_FRENZY','SOUL_TREMOR',['DOT'],'MYRIAD_WORLDS','สะท้อนเงามืดเข้ากัดกินขวัญกำลังใจศัตรูและดูดพลังชีวิตกลับมา'],
 ['ART_V210_ECLIPSE_NIGHTFALL','คมเคียวสุริยุปราคากลืนตะวัน','DEMON','ABYSSAL_MIRROR_ECLIPSE',4,'COMBAT_TECHNIQUE','attack',9.5,14,210,1.32,null,'OPEN','BLOOD_FRENZY','MERIDIAN_SEAL',['PIERCE','DOT'],'SECRET_REALM','ฟันผ่าเงาสุริยุปราคาใส่ศัตรูที่ขวัญเสียและดูดซับพลังชีวิต'],
 ['ART_V210_VOID_LUTE_REQUIEM','เพลงพิณสุญตาสะบั้นเจ็ดวิญญาณ','HEART_SOUL','VOID_LUTE_SOUL_WEAVER',4,'COMBAT_TECHNIQUE','attack',8.5,13,280,1.30,null,'RESONANCE','MIND_MIRROR','SOUL_TREMOR',['AREA','PIERCE'],'EXTERNAL_MASTER','ดีดสายพิณสุญตาประสานเสียงกังวานฉีกกระชากแนวป้องกันทางจิตของศัตรู'],

 // --- Buff-Granting Lightness / Movement Arts (วิชาก้าวพริบตาและตัวเบา) ---
 ['ART_V210_LIGHT_STAR_SHADOW','ท่าร่างเหยียบดาราไร้เงา','XIAN','STAR_SWORD_ASTROLOGY',3,'LIGHTNESS_ART','movement',6.0,7,320,.45,'OPEN',null,'WIND_STRIDE',null,[],'MYRIAD_WORLDS','เคลื่อนร่างตามตำแหน่งดาวเหนือ เพิ่มความเร็วเคลื่อนที่และโอกาสหลบคมอาวุธ'],
 ['ART_V210_LIGHT_MIST_DRIFT','ย่างก้าวหมอกบัวเร้นกาย','XIAN','MIST_LOTUS_ALCHEMY',2,'LIGHTNESS_ART','movement',5.5,6,300,.40,null,null,'WIND_STRIDE','FROST_SHACKLE',[],'EXTERNAL_MASTER','ถอยฉากพร้อมทิ้งไอหมอกเย็นเยียบชะลอการติดตามของศัตรู'],
 ['ART_V210_LIGHT_THUNDER_FLASH','ก้าวพริบตาอัสนีสวรรค์','GOD','CELESTIAL_THUNDER_EDICT',3,'LIGHTNESS_ART','movement',6.0,7,330,.50,'BOUND',null,'WIND_STRIDE',null,[],'SECRET_REALM','แปลงกายเป็นสายฟ้าพุ่งตัดระยะพร้อมทิ้งกระแสไฟฟ้าช็อตศัตรู'],
 ['ART_V210_LIGHT_ECLIPSE_STEP','เร้นเงาสุริยุปราคาสลับร่าง','DEMON','ABYSSAL_MIRROR_ECLIPSE',3,'LIGHTNESS_ART','movement',5.8,7,320,.45,'OPEN',null,'WIND_STRIDE','SOUL_TREMOR',[],'RUMOR_HERITAGE','สลับตำแหน่งกับเงามืดของตนเอง ทำให้ศัตรูโจมตีพลาดและจิตสั่นคลอน'],

 // --- Buff-Granting Qi Mantras (เคล็ดเดินปราณเสริมบัพและปราณสูงสุด) ---
 ['ART_V210_MANTRA_STAR_ORIGIN','คัมภีร์เดินปราณดาราจักรนิรันดร์','XIAN','STAR_SWORD_ASTROLOGY',3,'QI_MANTRA',null,8.0,6,180,0,null,null,'QI_SURGE',null,[],'MYRIAD_WORLDS','โคจรปราณตามจังหวะดารา เพิ่มความจุปราณและเร่งอัตราฟื้นฟูปราณในศึก'],
 ['ART_V210_MANTRA_DRAGON_VEIN','คัมภีร์ลมหายใจมังกรปฐพี','BODY','DRAGON_PULSE_SOVEREIGN',3,'QI_MANTRA',null,8.0,6,160,0,null,null,'IRON_AEGIS',null,[],'EXTERNAL_MASTER','เชื่อมลมหายใจเข้ากับชีพจรแผ่นดิน เสริมความแกร่งของกายเนื้อและเกราะปราณ'],
 ['ART_V210_MANTRA_THUNDER_DECREE','มนตราหัวใจอัสนีพิพากษา','GOD','CELESTIAL_THUNDER_EDICT',4,'QI_MANTRA',null,8.0,7,180,0,null,null,'QI_SURGE',null,[],'SECRET_REALM','หล่อเลี้ยงสายฟ้าศักดิ์สิทธิ์ในตันเถียน เพิ่มอานุภาพวิชาโจมตีอย่างต่อเนื่อง'],
 ['ART_V210_MANTRA_VOID_HARMONY','คัมภีร์จิตพิณสุญตาไร้คลื่น','HEART_SOUL','VOID_LUTE_SOUL_WEAVER',4,'QI_MANTRA',null,8.0,7,200,0,null,null,'MIND_MIRROR',null,[],'EXTERNAL_MASTER','ชำระจิตใจให้ใสกระจ่างดั่งกระจกเงา ลดการใช้ปราณของทุกกระบวนท่า'],

 // --- Auxiliary / Body-Protection & Recovery Arts (วิชาคุ้มกายและฟื้นฟู) ---
 ['ART_V210_AUX_DRAGON_SCALES','เกราะเกล็ดมังกรปฐพีสะท้อนคม','BODY','DRAGON_PULSE_SOVEREIGN',3,'AUXILIARY_ART','defense',7.5,8,180,.42,null,null,'IRON_AEGIS','ARMOR_SUNDER',[],'MYRIAD_WORLDS','สร้างม่านเกล็ดมังกรหินลดความเสียหายและสะท้อนแรงกระแทกใส่ผู้โจมตี'],
 ['ART_V210_AUX_LOTUS_NECTAR','น้ำทิพย์บัวหมอกชุบชีพจร','XIAN','MIST_LOTUS_ALCHEMY',3,'AUXILIARY_ART','recovery',8.5,9,240,0,null,null,'QI_SURGE',null,[],'EXTERNAL_MASTER','กลั่นไอโอสถบริสุทธิ์รักษาบาดแผลและชำระพิษสะสมในศึก'],
 ['ART_V210_AUX_MIRROR_WARD','ม่านกระจกเงาจันทราหักเหอาคม','DEMON','ABYSSAL_MIRROR_ECLIPSE',3,'AUXILIARY_ART','defense',7.5,8,210,.38,'OPEN',null,'MIND_MIRROR','SOUL_TREMOR',[],'SECRET_REALM','กางกระจกเงามืดหักเหการโจมตีและสะท้อนความหวาดหวั่นกลับสู่ศัตรู'],
 ['ART_V210_AUX_SOUL_CHIME','ระฆังหยกประโลมวิญญาณสหาย','HEART_SOUL','VOID_LUTE_SOUL_WEAVER',3,'AUXILIARY_ART','recovery',8.5,9,260,0,null,null,'MIND_MIRROR',null,[],'MYRIAD_WORLDS','สั่นระฆังจิตฟื้นฟูพลังชีวิตและประคองสติให้ทั้งตนเองและสหายร่วมรบ'],

 // --- High-Risk / High-Reward Forbidden Arts (วิชาต้องห้ามเร้นลับ) ---
 ['ART_V210_FORB_BLOOD_STAR','วิชาต้องห้าม: เผาโลหิตฝืนลิขิตดารา','XIAN','STAR_SWORD_ASTROLOGY',5,'FORBIDDEN_ART','forbidden',20.0,22,260,1.72,'BOUND','OPEN','SWORD_INTENT','ARMOR_SUNDER',['SWORD','PIERCE','AREA'],'MYRIAD_WORLDS','เผาผลาญพลังชีวิตและอายุขัยเพื่ออัญเชิญฝนกระบี่ดาราถล่มศัตรู'],
 ['ART_V210_FORB_DRAGON_HEART','วิชาต้องห้าม: ระเบิดหัวใจมังกรบรรพกาล','BODY','DRAGON_PULSE_SOVEREIGN',5,'FORBIDDEN_ART','forbidden',22.0,20,185,1.75,null,'BOUND','IRON_AEGIS','ARMOR_SUNDER',['PIERCE','AREA'],'SECRET_REALM','เร่งสูบฉีดโลหิตมังกรเกินขีดจำกัด แลกอายุขัยกับหมัดทลายปฐพี'],
 ['ART_V210_FORB_ECLIPSE_DEVOUR','วิชาต้องห้าม: สุริยุปราคากลืนกินสามภพ','DEMON','ABYSSAL_MIRROR_ECLIPSE',5,'FORBIDDEN_ART','forbidden',21.0,22,250,1.70,'OPEN',null,'BLOOD_FRENZY','MERIDIAN_SEAL',['DOT','AREA'],'MYRIAD_WORLDS','เปิดรอยแยกสุริยุปราคาดูดกลืนพลังชีวิตและปราณของศัตรูรอบทิศ'],
 ['ART_V210_FORB_THUNDER_TRIBULATION','วิชาต้องห้าม: เรียกทัณฑ์อสนีบาตล้างภพ','GOD','CELESTIAL_THUNDER_EDICT',5,'FORBIDDEN_ART','forbidden',22.0,24,280,1.76,null,'BOUND','QI_SURGE','ARMOR_SUNDER',['AREA','PIERCE'],'SECRET_REALM','ใช้กายตนเองเป็นสายล่อฟ้าดึงทัณฑ์สวรรค์ลงมาผ่าศัตรูโดยตรง'],
 ['ART_V210_FORB_VOID_SOUL_SEVER','วิชาต้องห้าม: สะบั้นสายพิณขาดวิญญาณ','HEART_SOUL','VOID_LUTE_SOUL_WEAVER',5,'FORBIDDEN_ART','forbidden',21.0,22,290,1.72,null,'RESONANCE','MIND_MIRROR','SOUL_TREMOR',['AREA','PIERCE'],'EXTERNAL_MASTER','ดีดสายพิณด้วยปราณชีวิตจนสายพิณขาดสะบั้น ทำลายขวัญและชีพจรศัตรู']
];
const worldArtsV210=WORLD_DISCOVERED_ARTS_V210_DEFS.map(([id,nameTh,path,subPath,tier,category,role,cooldown,qi,range,damage,setup,consume,buff,debuff,tags,discoveryChannel,loreTh])=>({
 id,
 nameTh,
 path,
 subPath,
 tier,
 requiredNormalizedTier:Math.max(1,tier-1),
 category,
 roleGroup:role==='forbidden'?'FORBIDDEN_HIGH_STAKES':role==='recovery'?'HEAL_SUPPORT_TRAINING':role==='defense'?'COMBAT_DEFENSE':role==='control'?'COMBAT_CONTROL':role==='movement'?'MOVEMENT_LIGHTNESS':'COMBAT_OFFENSE',
 power:48+tier*18,
 moves:[nameTh],
 costs:{qiCost:qi,vitalityCost:role==='forbidden'?18:0,lifespanCostYears:role==='forbidden'?1:0},
 effectBindings:role==='recovery'?[{effectId:'EFX_MASS_VITAL_HEAL'}]:role==='defense'?[{effectId:'EFX_REFLECT_BARRIER'}]:[{effectId:'EFX_STRIKE'}],
 hiddenWorldArt:true,
 discoveryChannel,
 canRedistribute:true,
 loreTh,
 combat117:{
  role,
  qi,
  cooldown,
  range,
  vitality:role==='forbidden'?4:0,
  damage,
  setup,
  consume,
  buff,
  debuff,
  setupSeconds:5.5,
  comboMultiplier:consume?1.38:1.25,
  tags:tags||[],
  heal:role==='recovery'?18+tier*3:0
 }
}));

const originalCatalog=E.getAllTechniquesCatalogV190.bind(E),originalGet=E.getTechniqueByIdV190?.bind(E),extraArtMap=new Map([...innates,...worldArtsV210].map(a=>[a.id,a]));
E.getAllTechniquesCatalogV190=()=>[...originalCatalog(),...innates,...worldArtsV210];
E.getTechniqueByIdV190=id=>extraArtMap.get(id)||originalGet?.(id)||originalCatalog().find(a=>a.id===id);
const cache=new WeakMap();
function mechanics(a){
 if(a.combat117)return a.combat117;
 if(cache.has(a))return cache.get(a);
 const fx=(a.effectBindings||[]).map(x=>x.effectId||'').join('|'),cat=a.category||'',rg=a.roleGroup||'';
 let role=/FORBIDDEN/.test(cat)?'forbidden':/LIGHTNESS|MOVEMENT/.test(cat)?'movement':/HEAL_SUPPORT/.test(rg)?'recovery':/COMBAT_CONTROL/.test(rg)?'control':/COMBAT_DEFENSE|SUPPORT_DEFENSE/.test(rg)?'defense':(/COMBAT_TECHNIQUE/.test(cat)||rg==='COMBAT_OFFENSE')?'attack':/BARRIER|REFLECT|PARRY|COUNTER/.test(fx)?'defense':/HEAL|PURGE|PURIFY|QI_TRANSFER/.test(fx)?'recovery':/LOCK|BIND|STAGGER|MENTAL_ATTACK/.test(fx)?'control':null;
 const tier=clamp(Number(a.tier)||1,1,9),seed=[...String(a.id)].reduce((s,c)=>s+c.charCodeAt(0),0);
 const tags=[];if(/SWORD/.test(a.subPath||a.id))tags.push('SWORD');
 if(/BURN|FIRE|FLAME/.test(fx+' '+a.element))tags.push('FIRE');
 if(/CHILL|FREEZE/.test(fx))tags.push('FROST');
 if(/BLEED|BLOOD|TOXIN|VENOM/.test(fx+' '+a.subPath))tags.push('DOT');
 if(/ARMOR|WEAKNESS/.test(fx))tags.push('PIERCE');
 if(/STORM|ANNIHILATION|CONDUCTION/.test(fx))tags.push('AREA');
 let setup=/CHILL|LOCK|BIND|GRAVITY/.test(fx)?'BOUND':/EXPOSURE|FRACTURE/.test(fx)?'OPEN':/FIVE_ELEMENTS|SOUND_ZITHER|CALLIGRAPHY/.test(a.subPath||'')?'RESONANCE':null;
 const consume=/STORM|SMITE|ANNIHILATION|SHOCK/.test(fx)?'BOUND':!setup&&role==='attack'?(/SOUND|FIVE_ELEMENTS|YIN_YANG|CALLIGRAPHY/.test(a.subPath||'')?'RESONANCE':'OPEN'):null;
 const floor=role==='forbidden'?24:role==='recovery'?12:role==='defense'?9:role==='movement'?8:role==='control'?8:4.5;
 const cooldown=Math.max(floor,Math.min(role==='forbidden'?42:18,(Number(a.cooldownTurns)||1)*1.7+tier*.45));
 const raw=Number(a.costs?.qiCost)||0;
 const qi=Math.round(clamp(raw?raw*.65:5+tier*1.5,role==='forbidden'?20:role==='control'?10:4,role==='forbidden'?55:34));
 const range=tags.includes('AREA')?220:/LONG|FAR/.test(a.rangeBand||'')?320:/MID|MEDIUM/.test(a.rangeBand||'')?245:145;
 const buff=role==='movement'?'WIND_STRIDE':role==='defense'?'IRON_AEGIS':/SWORD/.test(a.subPath||'')?'SWORD_INTENT':/ZEN|SCHOLAR|HEART_SOUL/.test((a.subPath||'')+' '+(a.path||''))?'MIND_MIRROR':/BLOOD|DEVOUR/.test(a.subPath||'')?'BLOOD_FRENZY':role==='recovery'?'QI_SURGE':null;
 const debuff=tags.includes('PIERCE')||/TIGER|TITAN|THUNDER|SOLAR/.test(a.subPath||'')?'ARMOR_SUNDER':tags.includes('FROST')||/FROST|OCEAN/.test(a.subPath||'')?'FROST_SHACKLE':/FATE|ZITHER|UNDERWORLD|NETHER/.test(a.subPath||'')?'MERIDIAN_SEAL':/DREAM|PHANTOM|SHADOW/.test(a.subPath||'')?'SOUL_TREMOR':null;
 const isZeroCdChain=role==='attack'&&tier===1&&(seed%5===0)&&!a.innateRoute;
 const finalCooldown=isZeroCdChain?0:cooldown;
 const finalQi=isZeroCdChain?Math.max(3,Math.min(5,qi)):qi;
 const m={role,qi:finalQi,cooldown:finalCooldown,range,vitality:Math.ceil(Math.max(0,Number(a.costs?.vitalityCost)||0)*.2),damage:isZeroCdChain?.86:role==='control'?.86:role==='defense'?.40:role==='forbidden'?1.65:1.06,setup,consume,buff,debuff,setupSeconds:5,comboMultiplier:1.32,tags:isZeroCdChain?[...tags,'CHAIN']:tags,heal:role==='recovery'?16+tier*2:0};cache.set(a,m);return m;
}
root.CombatData117={version:'2.01-combat-attributes',profiles,innates,worldArtsV210,hiddenSubpathsV210:HIDDEN_SUBPATHS_V210,styles:STYLES,mechanics,profile(n){return profiles[n?.jianghu?.path+':'+n?.jianghu?.subPath]||{path:n?.jianghu?.path,subPath:n?.jianghu?.subPath,realmCount:9,slots:[[1,1],[5,3],[8,4]],style:'duelist',...STYLES.duelist,innateIds:[],tradeoffTh:'สายอิสระ · ช่องตามขอบเขต 1–4'};}};
})(typeof globalThis!=='undefined'?globalThis:this);
