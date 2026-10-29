/* All skill reads/practice share one authority; extra weapon skills stay outside locked HC. */
(function(g){
'use strict';
const {MARTIAL:M,HC,STATS:ST,AI,CULT,U}=g,clamp=U.clamp;
const extra={BOW:'ฝีมือธนู',STAFF:'ฝีมือพลอง',FOCUS:'ฝีมือสื่อปราณ'};
const groups={weapon:['SWORD','BLADE','SPEAR','FIST_PALM','BOW','STAFF','FOCUS'],cultivation:['MOVEMENT','BODY_REFINING','SOUL_DIVINE','POISON','SCRIPTURE','ritual'],production:['ALCHEMY','FORGING','ARRAY','TALISMAN','MEDICINE','herbalism','mining','cooking','construction'],exploration:['BEAST_TAMING','stealth','survival'],social:['trading','administration','diplomacy','arts']};
M.SKILL_GROUPS=groups;M.SKILL_GROUP_NAMES={weapon:'อาวุธ',cultivation:'บำเพ็ญและเคล็ดภายใน',production:'การผลิตและการแพทย์',exploration:'สำรวจและอสูร',social:'สังคมและการจัดการ'};
M.SKILL_IDS=HC.SKILL_IDS.concat(Object.keys(extra));
const effects={
 SWORD:'เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้กระบี่',BLADE:'เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้ดาบ',SPEAR:'เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้หอก',FIST_PALM:'เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้สนับหรือมือเปล่า',BOW:'เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้ธนู',STAFF:'เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้พลอง',FOCUS:'เพิ่มพลังวิชา/ความแม่นยำและเจาะเกราะเมื่อใช้สื่อปราณ',
 ALCHEMY:'เพิ่มโอกาสสำเร็จ คุณภาพและความเร็วหลอมโอสถ',FORGING:'เพิ่มโอกาสสำเร็จ คุณภาพและความเร็วหลอมอุปกรณ์',ARRAY:'เพิ่มโอกาสสร้างค่ายกลและป้องกันวิชาในการรบ',TALISMAN:'เพิ่มโอกาสสร้างยันต์และเกราะในการรบ',BEAST_TAMING:'ลดความเสียหายจากอสูรจริง',POISON:'เพิ่มความแรงแผลพิษ/โลหิตจากวิชา',MEDICINE:'เพิ่มการฟื้นตัวของผู้ป่วยเมื่อเป็นหมอและโอกาสชำแหละอวัยวะ',SCRIPTURE:'เพิ่มความเร็วศึกษาวิชาและโอกาสถอดจารึก',MOVEMENT:'เพิ่มความเร็วเคลื่อนที่และหลบหลีก',BODY_REFINING:'เพิ่มพลังชีวิตและป้องกัน',SOUL_DIVINE:'เพิ่มโจมตีวิชาและป้องกันวิชา',herbalism:'เพิ่มจำนวน/ระดับสมุนไพรและข้าวที่เก็บได้',mining:'เพิ่มจำนวน/ระดับแร่ที่ขุดได้',cooking:'เพิ่มอาหารจากข้าวหนึ่งหน่วย',trading:'เพิ่มรายได้จากการค้าเดินทาง',administration:'ลดค่าใช้จ่ายดูแลสำนักและช่วยความเร็วขยายอาคาร',diplomacy:'เพิ่มผลเจรจาความสัมพันธ์/สนธิสัญญา',stealth:'เพิ่มหลบหลีกและคริติคอล',survival:'เพิ่มโอกาสผ่านอันตราย/หนีและลดอุบัติเหตุ',arts:'เพิ่มการคลายเครียดและขวัญใจจากดนตรี',construction:'ลดเวลาขยายอาคารจริง',ritual:'เพิ่มอัตราบำเพ็ญ โดยเฉพาะวิถีเทพ'};
const interests={ALCHEMY:'alchemy',FORGING:'forging',ARRAY:'arrays',TALISMAN:'arrays',BEAST_TAMING:'beasts',MEDICINE:'medicine',SCRIPTURE:'scholarship',MOVEMENT:'exploring',BODY_REFINING:'combat',SOUL_DIVINE:'worship',POISON:'alchemy',herbalism:'herbs',mining:'labor',cooking:'cuisine',trading:'trade',administration:'leading',diplomacy:'socializing',stealth:'intrigue',survival:'exploring',arts:'arts',construction:'building',ritual:'worship'};
M.SKILL_INFO=Object.fromEntries(M.SKILL_IDS.map(id=>[id,{id,nameTh:extra[id]||HC.nameOf('skills.'+id),group:Object.keys(groups).find(k=>groups[k].includes(id)),effect:effects[id],route:groups.weapon.includes(id)?'ฝึกหอยุทธ์/ใช้อาวุธจริง/รับการสอน':'งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน',interest:interests[id]||'combat'}]));
M.skillRead=(n,id)=>!n||!n.h||!M.SKILL_INFO[id]?0:clamp(Number.isFinite(extra[id]?n.martialSkills&&n.martialSkills[id]:n.h.skills[id])?(extra[id]?n.martialSkills[id]:n.h.skills[id]):0,0,100);
M.skillPractice=(n,id,hours,quality)=>{
 if(!M.SKILL_INFO[id]||!Number.isFinite(hours)||hours<=0||!Number.isFinite(quality==null?1:quality)||(quality!=null&&quality<=0))return 0;
 const q=clamp(quality==null?1:quality,.1,3)*(M.lifeMult?M.lifeMult(n,id):1);let gain;
 if(!extra[id])gain=HC.practice(n,id,hours,q);
 else{const level=M.skillRead(n,id),aff={BOW:'SWORD',STAFF:'SPEAR',FOCUS:'SOUL_DIVINE'}[id],rate=(.35+(HC.eff(n,'affinities.'+aff)||30)/100*.9)*(.6+HC.eff(n,'intellect.learningSpeed')/100*.8)*(.8+HC.eff(n,'interests.combat')/250)*q;gain=hours*.075*rate*Math.pow(Math.max(.08,1-level/105),1.6);n.martialSkills=n.martialSkills||{};n.martialSkills[id]=Math.min(100,level+gain);}
 if(gain&&(hours>=0.1||((groups.weapon.includes(id)||['SOUL_DIVINE','MOVEMENT','stealth','BODY_REFINING','TALISMAN','ARRAY'].includes(id))&&Math.floor(M.skillRead(n,id)*4)!==Math.floor((M.skillRead(n,id)-gain)*4))))ST.dirty(n);return gain||0;
};
M.isBeast=u=>!!u&&!!u.foe&&(u.kind==='beast'||!!u.wild&&!!u.speciesId);
M.gearUsable=(n,it)=>!!it&&(!n.cult||(it.minStage||1)<=n.cult.stage+1);
M.equippedType=n=>M.gearUsable(n,n.equip&&n.equip.WEAPON)?M.gearType(n.equip.WEAPON):'FIST';
M.pathSkillAffinity=(n,path,sub)=>{const profile=M.PROFILES[sub],preferred=profile?profile[3]:M.PATHS[path].weapons;return Math.max(...preferred.map(type=>M.weaponSkill(n,type)))*.18;};
M.weaponSkill=(n,type)=>M.skillRead(n,({FIST:'FIST_PALM'}[type||M.equippedType(n)]||type||M.equippedType(n)));
M.skillEffects=n=>{
 const eqW=n.equip&&n.equip.WEAPON,cPath=n.cult&&n.cult.path,sk=n.h.skills,ms=n.martialSkills,sec=n._skillEffectsCache;
 const skSig=(sk.ritual||0)+(sk.SCRIPTURE||0)*2+(sk.SOUL_DIVINE||0)*3+(sk.MOVEMENT||0)*5+(sk.BODY_REFINING||0)*7+(sk.POISON||0)*11+(sk.MEDICINE||0)*13+(sk.BEAST_TAMING||0)*17+(sk.SWORD||0)*19+(sk.BLADE||0)*23+(sk.SPEAR||0)*29+(sk.FIST_PALM||0)*31+(ms?(ms.BOW||0)*37+(ms.STAFF||0)*41+(ms.FOCUS||0)*43:0);
 if(sec&&sec.eqW===eqW&&sec.cPath===cPath&&sec.ver===n._ver&&sec.skSig===skSig)return sec.out;
 const v=id=>M.skillRead(n,id),weapon=M.weaponSkill(n),p={matk:(.8+.45*weapon/100-1)+v('SOUL_DIVINE')*.0015,acc:weapon*.0015,move:v('MOVEMENT')*.0018,eva:v('MOVEMENT')*.001+v('stealth')*.0013,hp:v('BODY_REFINING')*.0015,def:v('BODY_REFINING')*.0014+v('TALISMAN')*.0007,mdef:v('SOUL_DIVINE')*.0013+v('ARRAY')*.0009+v('TALISMAN')*.0005},f={crit:v('stealth')*.025};
 const out={p,f,beastDamage:1/(1+v('BEAST_TAMING')*.004),poisonPower:1+v('POISON')*.004,cultivation:1+v('ritual')*(cPath==='GOD'?.0035:.001),medicine:1+v('MEDICINE')*.004,study:1+v('SCRIPTURE')*.003,music:1+v('arts')*.005};
 n._skillEffectsCache={eqW,cPath,ver:n._ver,skSig,out};
 return out;
};
M.activeTechs=n=>{
 if(!n||!n.cult)return [];
 const c=n.cult,tl=c.techs.length,t0=tl?c.techs[0]:'',tL=tl?c.techs[tl-1]:'',effSt=CULT.effectiveTechStage?CULT.effectiveTechStage(n):c.stage,ac=n._actTechsCache;
 if(ac&&ac.path===c.path&&ac.sub===c.sub&&ac.st===effSt&&ac.tl===tl&&ac.t0===t0&&ac.tL===tL&&ac.ver===(n._passVer||0))return ac.out;
 if(M.reconcileInnate)M.reconcileInnate(n);
 const out=c.techs.filter(id=>{
  const t=CULT.tech(id);
  return !!t&&!M.isInnateTech(t)&&(t.path==='ANY'||t.path===c.path)&&(!t.sub||t.sub===c.sub)&&(t.reqTier||t.tier)<=effSt;
 });
 n._actTechsCache={path:c.path,sub:c.sub,st:effSt,tl,t0,tL,ver:n._passVer||0,out};
 return out;
};
M.pickSkillPractice=(W,n)=>{
 const intent=n.martialIntent;if(intent&&intent.action==='prepare'&&intent.targetKey){const k=M.knowledge&&M.knowledge(intent.targetKey),profile=k&&M.PROFILES[k.id];if(profile){const id={FIST:'FIST_PALM'}[profile[3][0]]||profile[3][0];if(M.skillRead(n,id)<75)return id;}}
 const wt=W?W.t:0,eqW=n.equip&&n.equip.WEAPON,psc=n._pspCache;
 if(psc&&wt-psc.t<15&&psc.post===n.post&&psc.eqW===eqW)return psc.best;
 let best=null,score=-Infinity;for(const id of M.SKILL_IDS){const info=M.SKILL_INFO[id],interest=HC.eff(n,'interests.'+info.interest),need=(100-M.skillRead(n,id))*.25,role=(n.post==='healer'&&id==='MEDICINE'||n.post==='steward'&&id==='construction'||n.post==='treasury'&&id==='administration')?20:0;const value=interest*.65+need+role+(groups.weapon.includes(id)&&id===({FIST:'FIST_PALM'}[M.equippedType(n)]||M.equippedType(n))?18:0);if(value>score){score=value;best=id;}}
 n._pspCache={t:wt,post:n.post,eqW,best};
 return best;
};
AI.ACTS.skillDrill={nameTh:'ฝึกทักษะเฉพาะ',icon:'🎯',color:'#a6c7e8',can:n=>n.h.state.energy>35&&n.h.state.satiety>30,score(n,W,S){const id=M.pickSkillPractice(W,n);S.add('ฝึก'+M.SKILL_INFO[id].nameTh,.25+(HC.eff(n,'interests.'+M.SKILL_INFO[id].interest)-50)/180+(n.martialIntent&&n.martialIntent.action==='prepare'?.7:0));},where(W,n){const skill=M.pickSkillPractice(W,n),weapon=groups.weapon.includes(skill),st=AI.freeStation(W,n,weapon?'dummy':'read',weapon?'training_ground':'scripture');return st?{st,skill}:null;},dur:()=>100,tick(n,W,ctx){M.skillPractice(n,ctx.skill,1/60,1.1);n.h.state.energy=Math.max(0,n.h.state.energy-.055);},done(n){n.merit=(n.merit||0)+.1;}};
// Training and teaching of additional proficiencies use the same native stations/actions.
const practiceWhere=AI.ACTS.practice.where;AI.ACTS.practice.where=(W,n)=>{const result=practiceWhere(W,n);if(result){const equipped={FIST:'FIST_PALM'}[M.equippedType(n)]||M.equippedType(n);if(groups.weapon.includes(equipped))result.skill=equipped;if(n.martialIntent&&n.martialIntent.action==='prepare')result.skill=M.pickSkillPractice(W,n);}return result;};
const pickTeach=AI.pickTeachSkill;AI.pickTeachSkill=(t,s)=>{const best=pickTeach(t,s),newSkill=Object.keys(extra).sort((a,b)=>M.skillRead(t,b)-M.skillRead(s,b)-M.skillRead(t,a)+M.skillRead(s,a))[0];return M.skillRead(t,newSkill)-M.skillRead(s,newSkill)>M.skillRead(t,best)-M.skillRead(s,best)?newSkill:best;};
})(typeof globalThis!=='undefined'?globalThis:this);
