/* Human Foundation v1. Canonical human dimensions, condition, experience, activities.
   Runs offline. New activities describe existing capacities; they do not add identity axes. */
(function(root){'use strict';
const E=root.World2026Engine||(typeof require==='function'?require('./legacy/src/engine'):null);
const D=root.JianghuNpcCoreData||(typeof require==='function'?require('./legacy/data/jianghu_npc_core_data'):null);
const VERSION=1,clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:50)),round=v=>{const n=Math.round(v*100)/100;return n===0?0:n;};
function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function random(seed){let s=hash(seed)||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};}
const bodyDefs=[
 ['strength','แรงกล้ามเนื้อ','แรงยกและงานหนัก'],['power','พลังระเบิด','กำลังปะทะและงานใช้แรงช่วงสั้น'],
 ['agility','ความคล่องตัว','เดินทางและต่อสู้'],['dexterity','ความละเอียดของมือ','งานประณีตและโอสถ'],
 ['coordination','การประสานร่างกาย','งานที่ใช้มือและเคลื่อนที่'],['balance','การทรงตัว','เดินทางและป้องกันตัว'],
 ['mobility','ช่วงการเคลื่อนไหว','การเคลื่อนไหวและงานภาคสนาม'],['durability','ความทนต่อแรงกระแทก','ลดความเสียหายจากการปะทะ'],
 ['metabolism','อัตราใช้พลังงาน','สูงแล้วหิวเร็วขึ้น'],['painTolerance','การทนความเจ็บ','ความพร้อมขณะเจ็บ'],
 ['immuneResilience','ความทนทานทางชีวภาพ','พักฟื้นและสลายพิษสะสม'],
 ['endurance','ความอึด','ความล้าและงานต่อเนื่อง','physiology'],['recoveryRate','การฟื้นตัว','พักฟื้นและบาดแผล','physiology'],
 ['senseAcuity','การรับรู้ประสาทสัมผัส','สังเกตและสำรวจ','physiology']
].map(([id,label,meaning,source])=>({id,label,meaning,source:source||'human',path:source?'core.physiology.'+id:'core.human.body.'+id}));
const cognitiveDefs=[
 ['reasoning','การให้เหตุผล','เข้าใจความสัมพันธ์และเรียนรู้','intelligence'],['planning','การวางแผน','จัดลำดับและประเมินงาน','planning'],
 ['workingMemory','ความจำใช้งาน','จัดการหลายขั้นตอน'],['attention','การคงสมาธิ','งานละเอียดและความชัดเจน'],
 ['episodicMemory','การจำเหตุการณ์','ระยะคงอยู่ของประสบการณ์'],['processingSpeed','ความเร็วประมวลผล','ความเร็วงานและการตัดสินใจ'],
 ['numeracy','ความเข้าใจเชิงปริมาณ','ค้า สัดส่วนยา และคำนวณ'],['spatialReasoning','ความเข้าใจพื้นที่','สำรวจ งานช่าง และต่อสู้'],
 ['verbalComprehension','ความเข้าใจภาษา','ตำราและการสื่อสาร'],['systemsThinking','ความเข้าใจระบบ','เชื่อมโยงสูตรและศาสตร์'],
 ['socialInsight','การเข้าใจผู้อื่น','สัมพันธ์และเจรจา'],['metacognition','การรู้ข้อจำกัดตน','ประเมินความสามารถและความเสี่ยง']
].map(([id,label,meaning,path])=>({id,label,meaning,source:path?'original':'human',path:path||'core.human.cognition.'+id}));
const interestDefs=[['analysis','วิเคราะห์และค้นเหตุผล'],['creation','สร้างสิ่งใหม่'],['competition','แข่งขันและท้าประลอง'],['exploration','ค้นพบและเดินทาง'],['care','ดูแลและช่วยเหลือ'],['exchange','ซื้อขายและต่อรอง'],['expression','แสดงออกและถ่ายทอด'],['companionship','อยู่ร่วมกับผู้คน'],['practice','ฝึกฝนซ้ำจนชำนาญ'],['tranquility','ความสงบและสันโดษ'],['leadership','นำและรับผิดชอบกลุ่ม'],['nature','อยู่กับธรรมชาติ'],['exertion','ใช้แรงและเคลื่อนไหว'],['risk','เสี่ยงและตื่นเต้น']].map(([id,label])=>({id,label,path:'core.human.interests.'+id}));
const parts=['head','torso','leftArm','rightArm','leftLeg','rightLeg'],partLabels={head:'ศีรษะ',torso:'ลำตัว',leftArm:'แขนซ้าย',rightArm:'แขนขวา',leftLeg:'ขาซ้าย',rightLeg:'ขาขวา'};
const activities=Object.create(null),ids=a=>new Set(a.map(d=>d.id));
const groups={valueWeights:ids(D.VALUE_DIMENSIONS_8),personalityWeights:ids(D.PERSONALITY_AXES_14),aptitudeWeights:ids(D.APTITUDE_DOMAINS_6),bodyWeights:ids(bodyDefs),cognitiveWeights:ids(cognitiveDefs),interestWeights:ids(interestDefs)};
const readPath=(n,p)=>p.split('.').reduce((o,k)=>o?.[k],n);
function raw(n,kind,id){if(kind==='aptitude')return clamp(n.core.aptitudes[id]);const def=({body:bodyDefs,cognition:cognitiveDefs,interest:interestDefs}[kind]||[]).find(d=>d.id===id);if(!def)throw Error('Unknown human dimension '+kind+'.'+id);return clamp(readPath(n,def.path));}
function validate(n){const h=n.core.human,check=(v,p)=>{if(!Number.isFinite(v)||v<0||v>100)throw Error('ข้อมูลตัวตนไม่ถูกต้อง: '+p);};
 for(const d of [...bodyDefs,...cognitiveDefs,...interestDefs])check(readPath(n,d.path),d.path);
 for(const k of ['autonomy','competence','stimulation','pain','grief'])check(h.state?.[k],k);for(const p of parts)check(h.state?.parts?.[p],p);
 if(!h.form||!Number.isFinite(h.form.heightCm)||h.form.heightCm<=0||!Number.isFinite(h.form.massKg)||h.form.massKg<=0||!h.experience?.skills||!h.experience?.beliefs||!Array.isArray(h.experience?.reflections))throw Error('โครงสร้างตัวตน NPC ไม่ครบ');
 if(!['left','right','both'].includes(h.form.handedness)||![h.form.skinTone,h.form.hairTone].every(c=>/^#[0-9a-f]{6}$/i.test(c)))throw Error('ข้อมูลสรีระ NPC ไม่ถูกต้อง');
 if(Array.isArray(h.experience.skills)||Array.isArray(h.experience.beliefs)||!Number.isFinite(h.experience.completed)||h.experience.completed<0)throw Error('ข้อมูลประสบการณ์ NPC ไม่ถูกต้อง');
 for(const [id,s] of Object.entries(h.experience.skills)){check(s?.level,'skills.'+id);if(!Number.isFinite(s.practice)||s.practice<0)throw Error('ข้อมูลการฝึกไม่ถูกต้อง: '+id);}
 for(const [id,b] of Object.entries(h.experience.beliefs))if(!Number.isInteger(b.count)||b.count<1||!Number.isFinite(b.total)||!Number.isFinite(b.lastAt)||!Number.isFinite(b.expected)||Math.abs(b.expected)>20)throw Error('ข้อมูลความทรงจำไม่ถูกต้อง: '+id);
 return true;
}
function ensure(n,seed=0,{fresh=false}={}){if(!n?.core)throw Error('Human identity requires the original NPC core');if(fresh)delete n.core.human;
 if(n.core.human?.schemaVersion>VERSION)throw Error('เซฟใช้รากฐานตัวตน NPC รุ่นใหม่กว่าเกมนี้');
 if(n.core.human?.schemaVersion===VERSION){validate(n);return n.core.human;}if(n.core.human)throw Error('ไม่รู้จักรุ่นข้อมูลตัวตน NPC');
 const key=seed+':'+n.id+':human-v1',r=random(key+':form'),roll=id=>{const f=random(key+':'+id);return Math.round(18+(f()+f()+f())/3*76);};
 const h={schemaVersion:VERSION,identityId:'JI-'+hash(seed+':'+n.id).toString(16).padStart(8,'0'),body:{},cognition:{},interests:{},
  form:{heightCm:Math.round(150+r()*43),massKg:Math.round(45+r()*47),handedness:r()<.11?'left':r()<.06?'both':'right',skinTone:['#d5ad85','#bc8e66','#e4c6a0','#a87854'][Math.floor(r()*4)],hairTone:['#263833','#463d31','#6c6050','#393945'][Math.floor(r()*4)],eyeTone:['น้ำตาล','ดำ','อำพัน'][Math.floor(r()*3)]},
  state:{autonomy:25,competence:25,stimulation:20,pain:0,grief:0,parts:Object.fromEntries(parts.map(p=>[p,0]))},experience:{skills:{},beliefs:{},reflections:[],completed:0}};
 for(const d of bodyDefs)if(d.source==='human')h.body[d.id]=roll('body:'+d.id);
 for(const d of cognitiveDefs)if(d.source==='human')h.cognition[d.id]=roll('cognition:'+d.id);
 for(const d of interestDefs)h.interests[d.id]=Math.round(8+random(key+':interest:'+d.id)()*84);
 n.core.human=h;
 // Original factory copies these scalars from a template. Only new people are varied.
 if(fresh){n.intelligence=roll('cognition:reasoning');n.planning=roll('cognition:planning');E.invalidateNpcCoreCache(n);}return h;
}
function registerActivity(def){if(!def||!/^[-\w:.]+$/.test(def.id)||!def.label)throw Error('Activity needs stable id and label');const d={skillDomain:def.id,effort:30,...def};
 for(const [group,valid] of Object.entries(groups)){const weights={...def[group]};for(const [k,w] of Object.entries(weights)){if(!valid.has(k)||!Number.isFinite(w))throw Error('Unknown human axis: '+group+'.'+k);if(['bodyWeights','cognitiveWeights','aptitudeWeights'].includes(group)&&w<0)throw Error('Capability weights must be nonnegative');}d[group]=Object.freeze(weights);}
 d.needRelief=Object.freeze({...def.needRelief});for(const [k,v] of Object.entries(d.needRelief))if(!['autonomy','competence','stimulation','social'].includes(k)||!Number.isFinite(v))throw Error('Unknown need '+k);
 activities[d.id]=Object.freeze(d);return d;
}
const neutral={id:'unknown',label:'กิจกรรม',skillDomain:'general',valueWeights:{},personalityWeights:{},aptitudeWeights:{},bodyWeights:{},cognitiveWeights:{},interestWeights:{},needRelief:{}};
function descriptor(id){return activities[id]||activities[id?.startsWith('bounty:')?'bounty':id]||neutral;}
function condition(n){const h=n.core.human,s=n.stageLocal?.needs||{},c=n.core.condition||{},max=n.stageLocal?.boss?240:100;return {fatigue:clamp(c.fatigue??0),hunger:clamp(s.hunger??0),stress:clamp(c.moodStress??0),pain:h.state.pain*(1-raw(n,'body','painTolerance')*.005),healthRatio:clamp(n.health,0,max)/max};}
function effective(n,kind,id){const base=raw(n,kind,id);if(kind==='body'&&['recoveryRate','immuneResilience','metabolism','painTolerance'].includes(id))return base;
 const s=condition(n),p=n.core.human.state.parts;let loss=kind==='cognition'?s.fatigue*.0022+s.hunger*.0013+s.stress*.0017+s.pain*.0012:s.fatigue*.002+s.hunger*.0011+(1-s.healthRatio)*.2+s.pain*.0015;
 if(kind==='body'){loss+=p.torso*.0015;if(['dexterity','strength','power','coordination'].includes(id))loss+=(p.leftArm+p.rightArm)*.003;if(['agility','balance','mobility','endurance'].includes(id))loss+=(p.leftLeg+p.rightLeg)*.003;if(id==='senseAcuity')loss+=p.head*.004;}else loss+=p.head*.004+p.torso*.0005;
 return round(clamp(base*Math.max(.25,1-loss)));
}
function weighted(n,kind,weights,eff=true){let sum=0,total=0;for(const [k,w] of Object.entries(weights||{})){sum+=(eff?effective(n,kind,k):raw(n,kind,k))*w;total+=w;}return total?sum/total:50;}
function skill(n,id){return n.core.human.experience.skills[id]?.level??0;}
function liking(n,id){return round(clamp(50+Object.entries(descriptor(id).interestWeights).reduce((s,[k,w])=>s+(raw(n,'interest',k)-50)*w,0)));}
function capacity(n,id){const d=descriptor(id),body=weighted(n,'body',d.bodyWeights),cognition=weighted(n,'cognition',d.cognitiveWeights),aptitude=weighted(n,'aptitude',d.aptitudeWeights,false),learned=skill(n,d.skillDomain),hasBody=Object.keys(d.bodyWeights).length>0,hasMind=Object.keys(d.cognitiveWeights).length>0,foundation=hasBody&&hasMind?body*.45+cognition*.55:hasBody?body:cognition;return {body:round(body),cognition:round(cognition),aptitude:round(aptitude),skill:round(learned),total:round(clamp(foundation*.6+aptitude*.25+(30+learned*.7)*.15))};}
function clarity(n){return round(weighted(n,'cognition',{reasoning:.14,planning:.2,workingMemory:.12,attention:.2,processingSpeed:.1,metacognition:.24}));}
function temperature(n){return round(clamp(15-clarity(n)*.12,4,14));}
function evaluate(n,id,{risk=0}={}){const d=descriptor(id),h=n.core.human,cap=capacity(n,id),interest=liking(n,id),meta=effective(n,'cognition','metacognition'),interestAdj=round((interest-50)*.34),capabilityAdj=round((cap.total-50)*.16*(.35+meta*.0065));let needAdj=0;
 for(const [k,w] of Object.entries(d.needRelief)){const unmet=k==='social'?(n.stageLocal?.needs?.social??0):h.state[k];needAdj+=(unmet-25)*w*.22;}needAdj=round(clamp(needAdj,-8,18));
 const readiness=cap.total*.65+condition(n).healthRatio*35,riskEstimateAdj=round(-Math.max(0,risk-readiness)*(.06+meta*.0018));return {interest,...cap,interestAdj,capabilityAdj,needAdj,riskEstimateAdj,bias:round(interestAdj+capabilityAdj+needAdj+riskEstimateAdj)};
}
function option(n,opt,id=opt.id){for(const [group,valid] of Object.entries(groups))for(const [key,weight] of Object.entries(opt[group]||{}))if(!valid.has(key)||!Number.isFinite(weight))throw Error('Unknown human axis: '+group+'.'+key);const d=descriptor(id),human=evaluate(n,id,{risk:opt.riskLevel||0});return {...opt,baseScore:round((opt.baseScore??50)+human.bias),valueWeights:{...d.valueWeights,...opt.valueWeights},personalityWeights:{...d.personalityWeights,...opt.personalityWeights},aptitudeWeights:{...d.aptitudeWeights,...opt.aptitudeWeights},human,activityId:d.id};}
function movement(n){return clamp(.65+(effective(n,'body','agility')*.36+effective(n,'body','balance')*.2+effective(n,'body','mobility')*.24+effective(n,'body','coordination')*.2)*.007,.4,1.35);}
function travelSpeed(n,base=48){const burden=Math.max(.6,1-Math.max(0,load(n)-carryLimit(n))*.015);return base*movement(n)*burden;}
function combat(n){return clamp(.7+(effective(n,'body','strength')*.24+effective(n,'body','power')*.24+effective(n,'body','agility')*.18+effective(n,'body','coordination')*.12+effective(n,'cognition','spatialReasoning')*.12+effective(n,'body','balance')*.1)*.006,.45,1.3);}
function damageMultiplier(n){return clamp(1.17-effective(n,'body','durability')*.0034,.82,1.2);}
function recovery(n){return clamp(.55+(raw(n,'body','recoveryRate')*.7+raw(n,'body','immuneResilience')*.3)*.009,.55,1.45);}
function workRate(n,id){return clamp(.62+capacity(n,id).total*.0076,.55,1.38);}
function learningRate(n,id){const d=descriptor(id),mind=weighted(n,'cognition',Object.keys(d.cognitiveWeights).length?d.cognitiveWeights:{reasoning:1,attention:1}),apt=weighted(n,'aptitude',d.aptitudeWeights,false);return round(clamp(.45+mind*.007+apt*.003,.45,1.45));}
function carryLimit(n){return Math.floor(8+raw(n,'body','strength')*.18+raw(n,'body','endurance')*.1);}
function load(n){return (n.jianghu?.ledgerV140?.materialStacks||[]).reduce((s,x)=>s+Math.max(0,x.count||0),0);}
function harvestLimit(n,id){return Math.max(0,Math.min(Math.floor(1.5+capacity(n,id).body*.025+skill(n,descriptor(id).skillDomain)*.008),carryLimit(n)-load(n)));}
function learn(n,id,amount=1){if(!Number.isFinite(amount)||amount<0)throw Error('Practice amount must be finite and nonnegative');const d=descriptor(id),h=n.core.human,e=h.experience,s=e.skills[d.skillDomain]||(e.skills[d.skillDomain]={level:0,practice:0}),gain=amount*learningRate(n,id)*(1-s.level/115),relief=Math.min(1,amount);s.practice=round(s.practice+amount);s.level=round(clamp(s.level+gain));e.completed=round(e.completed+amount);h.state.competence=clamp(h.state.competence-10*relief);h.state.autonomy=clamp(h.state.autonomy-(liking(n,id)>50?8:2)*relief);h.state.stimulation=clamp(h.state.stimulation-(d.needRelief.stimulation?12:4)*relief);return round(gain);}
function memoryBias(n,id,time){const m=raw(n,'cognition','episodicMemory'),retention=400+m*7,b=n.core.human.experience.beliefs[id],episodes=(n.stageLocal?.memories||[]).filter(e=>e.action===id).reduce((s,e)=>s+e.valence*Math.max(0,1-(time-e.t)/retention),0),lesson=b?b.expected*Math.min(.35,b.count*.04)*Math.max(0,1-(time-b.lastAt)/(2500+m*20)):0;return round(episodes+lesson);}
function remember(n,action,valence,text,time){const h=n.core.human,m=n.stageLocal?.memories;if(!m)return false;valence=clamp(valence,-20,20);if(m.some(e=>e.action===action&&time-e.t<30&&Math.sign(e.valence)===Math.sign(valence)))return false;m.unshift({t:time,action,valence,text,importance:round(Math.min(100,Math.abs(valence)*5)),source:'experienced'});m.splice(32);const b=h.experience.beliefs,e=b[action]||(b[action]={count:0,total:0,expected:0,lastAt:0});e.count++;e.total=round(e.total+valence);e.expected=round(e.total/e.count);e.lastAt=time;if(e.count%4===0){h.experience.reflections.unshift({t:time,action,count:e.count,expected:e.expected,text:(e.expected>=0?'มีประสบการณ์ที่ดีซ้ำกับ ':'ควรระวังมากขึ้นเมื่อ ')+descriptor(action).label,source:'own_observations'});h.experience.reflections.splice(12);}return true;}
function injure(n,amount,time=0){const h=n.core.human;if(!h)return;const p=parts[(hash(n.id)+Math.floor(time*10))%parts.length];h.state.parts[p]=round(clamp(h.state.parts[p]+amount*.16));h.state.pain=round(clamp(h.state.pain+amount*.5));}
function recover(n,amount){const s=n.core.human.state;s.pain=round(clamp(s.pain-amount));for(const p of parts)s.parts[p]=round(clamp(s.parts[p]-amount*.35));}
function tick(n,dt){const h=n.core.human,s=n.stageLocal;if(!s?.needs)return;s.needs.hunger=clamp(s.needs.hunger+dt*.12*(.65+raw(n,'body','metabolism')*.007));s.needs.social=clamp(s.needs.social+dt*(.025+raw(n,'interest','companionship')*.0005));s.needs.safety=clamp(100-n.health);h.state.autonomy=clamp(h.state.autonomy+dt*.025);h.state.competence=clamp(h.state.competence+dt*.03);h.state.stimulation=clamp(h.state.stimulation+dt*(s.lastWork!==null&&s.lastWork===s.action ? .06:.025));h.state.grief=Math.max(0,h.state.grief-dt*.01);
 const active=['travel','combat','working'].includes(s.mode)&&!['rest','heal','eat','seclusion'].includes(s.action);if(active)n.core.condition.fatigue=clamp(n.core.condition.fatigue+dt*(.018+(100-raw(n,'body','endurance'))*.0007)*(s.mode==='combat'?2:1));
 n.core.condition.moodStress=clamp(s.needs.hunger*.16+s.needs.social*.15+(100-n.health)*.25+h.state.pain*.15+(h.state.autonomy+h.state.competence+h.state.stimulation)*.045+h.state.grief*.2);if(n.jianghu?.poisonAccumulated>0)n.jianghu.poisonAccumulated=Math.max(0,n.jianghu.poisonAccumulated-dt*raw(n,'body','immuneResilience')*.0004);
}
function emotions(n){const s=n.core.human.state,c=condition(n);return {valence:round(clamp(80-c.stress*.7-s.grief*.25)),arousal:round(clamp(25+(n.stageLocal?.danger||0)*.4+c.stress*.2)),fear:round(clamp((n.stageLocal?.danger||0)*.5+c.pain*.25+(1-c.healthRatio)*35)),confidence:round(clamp(25+clarity(n)*.5-s.competence*.12+Math.min(20,n.core.human.experience.completed))),grief:round(s.grief)};}
function fingerprint(n){return hash(JSON.stringify({values:n.core.values,personality:D.PERSONALITY_AXES_14.map(d=>n.personality[d.id]),body:bodyDefs.map(d=>raw(n,'body',d.id)),cognition:cognitiveDefs.map(d=>raw(n,'cognition',d.id)),aptitudes:n.core.aptitudes,interests:n.core.human.interests,form:n.core.human.form,physiology:n.core.physiology})).toString(16).padStart(8,'0');}
function differences(a,b){const rows=[];for(const [kind,defs] of [['body',bodyDefs],['cognition',cognitiveDefs],['interest',interestDefs]])for(const d of defs)rows.push({kind,label:d.label,a:raw(a,kind,d.id),b:raw(b,kind,d.id)});for(const [kind,defs,read] of [['value',D.VALUE_DIMENSIONS_8,n=>n.core.values],['personality',D.PERSONALITY_AXES_14,n=>n.personality],['aptitude',D.APTITUDE_DOMAINS_6,n=>n.core.aptitudes]])for(const d of defs)rows.push({kind,label:d.nameTh,a:read(a)[d.id],b:read(b)[d.id]});return rows.map(r=>({...r,delta:round(r.a-r.b)})).sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));}
const add=(id,label,v,b,c,i,a={},need={},effort=30,skillDomain=id)=>registerActivity({id,label,valueWeights:v,bodyWeights:b,cognitiveWeights:c,interestWeights:i,aptitudeWeights:a,needRelief:need,effort,skillDomain});
add('eat','กินอาหาร',{familyClan:.14,freedom:.04},{},{},{tranquility:.2},{},{autonomy:.1},0);
add('rest','พักฟื้น',{familyClan:.22,freedom:.1,martialPeak:-.08},{recoveryRate:.7,immuneResilience:.3},{},{tranquility:.7},{},{autonomy:.3},0);
add('heal','รักษาบาดแผล',{familyClan:.28,martialPeak:.08},{recoveryRate:.7,immuneResilience:.3},{},{care:.3,tranquility:.4},{},{autonomy:.2},0);
add('train','ฝึกบ่มเพาะ',{martialPeak:.5,knowledgeCraft:.18,honorLegacy:.1},{endurance:.7,coordination:.3},{reasoning:.15,attention:.3,verbalComprehension:.2,systemsThinking:.35},{practice:.65,tranquility:.25},{cultivation:.14,comprehension:.08},{competence:1},45,'cultivation');
add('breakthrough','เตรียมทะลวงขั้น',{martialPeak:.6,powerStatus:.18,honorLegacy:.16,familyClan:-.1},{endurance:.5,painTolerance:.5},{planning:.25,attention:.25,systemsThinking:.25,metacognition:.25},{practice:.5,risk:.2},{cultivation:.16,comprehension:.08},{competence:1},70,'cultivation');
add('herb','เก็บสมุนไพร',{sectDuty:.24,knowledgeCraft:.16,wealthResource:.14},{dexterity:.3,senseAcuity:.4,mobility:.1,coordination:.2},{attention:.45,systemsThinking:.3,spatialReasoning:.25},{nature:.6,care:.25,analysis:.15},{crafting:.08,comprehension:.04},{stimulation:.2,competence:.3},35,'gathering');
add('mine','ขุดแร่',{wealthResource:.3,sectDuty:.24},{strength:.4,power:.15,endurance:.25,coordination:.2},{spatialReasoning:.6,attention:.4},{exertion:.65,nature:.15},{crafting:.07},{competence:.2},65,'gathering');
add('wood','เก็บไม้ไผ่',{sectDuty:.3,wealthResource:.12},{strength:.35,power:.2,balance:.15,mobility:.15,endurance:.15},{spatialReasoning:.7,attention:.3},{exertion:.55,nature:.4},{crafting:.06},{competence:.2},55,'gathering');
add('deposit','ส่งของเข้าคลัง',{sectDuty:.42,familyClan:.14,honorLegacy:.14,wealthResource:-.12,freedom:-.08},{strength:.6,endurance:.4},{planning:.6,numeracy:.4},{care:.25,leadership:.25},{command:.06},{competence:.1},20,'stewardship');
add('scout','สำรวจสันเขา',{freedom:.42,knowledgeCraft:.3,martialPeak:.08,familyClan:-.12},{senseAcuity:.4,agility:.2,balance:.2,mobility:.2},{spatialReasoning:.4,planning:.25,workingMemory:.2,metacognition:.15},{exploration:.6,nature:.25,risk:.15},{comprehension:.1},{stimulation:1,autonomy:.8},40,'exploration');
add('hunt','ล่าอสูร',{martialPeak:.35,wealthResource:.16,honorLegacy:.12,familyClan:-.2},{strength:.25,power:.2,agility:.2,endurance:.15,balance:.2},{spatialReasoning:.35,processingSpeed:.35,attention:.3},{competition:.45,exertion:.25,risk:.3},{combat:.14},{competence:.7,stimulation:.4},80,'combat');
add('assault','บุกค่ายโจร',{martialPeak:.24,powerStatus:.3,honorLegacy:.2,sectDuty:.18,familyClan:-.24},{strength:.2,power:.2,agility:.2,endurance:.4},{planning:.4,spatialReasoning:.3,workingMemory:.3},{competition:.4,risk:.4,leadership:.2},{combat:.12,command:.04},{competence:.7,stimulation:.5},85,'combat');
add('defend','ป้องกันผู้คน',{sectDuty:.46,honorLegacy:.3,familyClan:.15,powerStatus:.14},{strength:.25,durability:.2,balance:.2,endurance:.35},{planning:.4,spatialReasoning:.3,socialInsight:.3},{care:.5,leadership:.3,competition:.2},{combat:.12,command:.05},{competence:.6,social:.3},70,'combat');
add('bounty','รับประกาศค่าหัว',{wealthResource:.36,honorLegacy:.24,powerStatus:.16,sectDuty:.16,familyClan:-.16},{strength:.2,power:.2,endurance:.3,agility:.3},{planning:.4,metacognition:.3,spatialReasoning:.3},{competition:.4,risk:.25,exchange:.2,exploration:.15},{combat:.12,command:.03},{competence:.7,stimulation:.4},75,'combat');
add('trade','ค้าข้ามด่าน',{wealthResource:.45,freedom:.38,powerStatus:.12,familyClan:-.08},{endurance:.7,senseAcuity:.3},{numeracy:.35,planning:.25,socialInsight:.2,verbalComprehension:.2},{exchange:.65,exploration:.25,risk:.1},{socialCommerce:.14},{autonomy:.8,stimulation:.5},25,'negotiation');
add('buy','ซื้อเสบียง',{wealthResource:.1,familyClan:.12},{},{numeracy:.5,socialInsight:.5},{exchange:.6,care:.2},{socialCommerce:.1},{autonomy:.2},10,'negotiation');
add('social','เยี่ยมหมู่บ้าน',{familyClan:.4,sectDuty:.18,honorLegacy:.18,powerStatus:.1},{},{socialInsight:.45,verbalComprehension:.35,workingMemory:.2},{companionship:.65,expression:.2,care:.15},{socialCommerce:.1},{social:1,autonomy:.2},10,'relationships');
add('craft','จัดหางานช่าง',{knowledgeCraft:.42,honorLegacy:.2,wealthResource:.16},{},{planning:.4,numeracy:.3,verbalComprehension:.3},{creation:.5,analysis:.2,exchange:.3},{socialCommerce:.08,crafting:.04},{competence:.5},15,'negotiation');
add('equip','ปรับอุปกรณ์',{martialPeak:.2,knowledgeCraft:.15},{dexterity:.6,coordination:.4},{spatialReasoning:.6,systemsThinking:.4},{creation:.35,analysis:.3},{crafting:.08},{competence:.4},20,'equipment');
add('alchemy','หลอมโอสถ',{knowledgeCraft:.5,honorLegacy:.2,wealthResource:.16},{dexterity:.5,senseAcuity:.3,coordination:.2},{numeracy:.2,systemsThinking:.3,attention:.3,workingMemory:.2},{creation:.4,analysis:.3,care:.2,tranquility:.1},{crafting:.14,comprehension:.08},{competence:1},45);
add('forging','สร้างศาสตรา',{knowledgeCraft:.4,martialPeak:.24,honorLegacy:.2},{strength:.2,power:.15,dexterity:.25,coordination:.25,endurance:.15},{spatialReasoning:.45,systemsThinking:.3,attention:.25},{creation:.6,exertion:.3,analysis:.1},{crafting:.16},{competence:1},65);
add('path:XIAN','วิถีเซียนปราณ',{martialPeak:.25,knowledgeCraft:.4,freedom:.15},{senseAcuity:.6,endurance:.4},{systemsThinking:.4,attention:.35,reasoning:.25},{analysis:.3,tranquility:.45,practice:.25},{cultivation:.2,comprehension:.1});
add('path:BODY','วิถีกายา',{martialPeak:.45,powerStatus:.18},{strength:.3,power:.2,endurance:.3,painTolerance:.2},{attention:.5,metacognition:.5},{exertion:.6,competition:.25,practice:.15},{cultivation:.2,combat:.1});
add('path:GOD','วิถีเทพ',{sectDuty:.4,honorLegacy:.25,familyClan:.15,powerStatus:.1},{endurance:.5,senseAcuity:.5},{socialInsight:.45,verbalComprehension:.3,planning:.25},{care:.4,leadership:.35,expression:.25},{cultivation:.15,command:.1,socialCommerce:.05});
// Semantic demands of existing disciplines; no array-position selection rules.
function sub(id,basis,pw={},overrides={}){const original=Object.values(E.CULTIVATION_PATHS).flatMap(p=>Object.values(p.subPaths)).find(p=>p.id===id);registerActivity({...activities[basis],id:'subpath:'+id,label:original?.nameTh||id,skillDomain:'cultivation',personalityWeights:pw,...overrides});}
sub('SWORD_IMMORTAL','hunt',{courage:.3,discipline:.3,pride:.15},{bodyWeights:{dexterity:.4,agility:.4,coordination:.2},valueWeights:{martialPeak:.55,honorLegacy:.2,freedom:.1}});
sub('FIVE_ELEMENTS','path:XIAN',{rationality:.35,composure:.3},{interestWeights:{nature:.5,analysis:.3,practice:.2}});
sub('ELIXIR_DAO','alchemy',{creativity:.3,discipline:.25,curiosity:.2});
sub('ASTRAL_ARRAY','alchemy',{rationality:.35,caution:.3},{cognitiveWeights:{numeracy:.35,spatialReasoning:.35,workingMemory:.3},interestWeights:{creation:.5,analysis:.5},valueWeights:{knowledgeCraft:.45,sectDuty:.25}});
sub('BLOOD_DEMON','assault',{aggression:.4,integrity:-.25,empathy:-.2},{valueWeights:{powerStatus:.45,martialPeak:.4,honorLegacy:-.15},interestWeights:{competition:.5,risk:.5}});
sub('PHANTOM_SOUL','scout',{caution:.3,creativity:.3},{interestWeights:{analysis:.3,exploration:.3,tranquility:.4},cognitiveWeights:{socialInsight:.3,attention:.4,spatialReasoning:.3}});
sub('TIME_VOID','path:XIAN',{curiosity:.4,rationality:.3},{cognitiveWeights:{systemsThinking:.5,workingMemory:.25,spatialReasoning:.25},interestWeights:{analysis:.6,exploration:.4}});
sub('SOUND_ZITHER','path:XIAN',{creativity:.4,empathy:.2},{bodyWeights:{dexterity:.6,senseAcuity:.4},cognitiveWeights:{attention:.35,verbalComprehension:.3,socialInsight:.35},interestWeights:{expression:.6,creation:.25,companionship:.15}});
sub('YIN_YANG_HARMONY','path:XIAN',{composure:.4,rationality:.3},{bodyWeights:{balance:.6,coordination:.4},interestWeights:{tranquility:.5,practice:.5}});
sub('SPIRIT_PUPPET_MECHANICA','forging',{creativity:.4,caution:.25},{cognitiveWeights:{workingMemory:.4,systemsThinking:.3,spatialReasoning:.3},valueWeights:{knowledgeCraft:.5,sectDuty:.2}});
sub('TIGER_SOVEREIGN','path:BODY',{aggression:.4,courage:.3},{bodyWeights:{power:.5,agility:.3,strength:.2},interestWeights:{competition:.5,exertion:.4,risk:.1}});
sub('BLOOD_DRAGON','path:BODY',{ambition:.35,pride:.25},{bodyWeights:{recoveryRate:.4,strength:.4,endurance:.2},valueWeights:{familyClan:.3,martialPeak:.4,powerStatus:.25}});
sub('VAJRA_BODHI','defend',{composure:.35,discipline:.3,empathy:.2},{bodyWeights:{durability:.5,endurance:.3,painTolerance:.2},interestWeights:{tranquility:.4,care:.3,practice:.3}});
sub('DEVOURING_FIEND','hunt',{aggression:.4,courage:.3,caution:-.2},{valueWeights:{martialPeak:.5,freedom:.25,powerStatus:.2},interestWeights:{risk:.5,exertion:.5}});
sub('SOLAR_FORGE','forging',{creativity:.35,discipline:.3});
sub('THUNDER_BODY','path:BODY',{courage:.4,ambition:.3},{bodyWeights:{agility:.4,power:.3,painTolerance:.3},interestWeights:{risk:.45,exertion:.4,practice:.15}});
sub('JADE_IMMORTAL_BODY','path:BODY',{caution:.4,composure:.3},{bodyWeights:{immuneResilience:.5,recoveryRate:.3,durability:.2},valueWeights:{familyClan:.3,martialPeak:.4},interestWeights:{tranquility:.5,practice:.3,care:.2}});
sub('TITAN_MOUNTAIN_BODY','defend',{loyalty:.35,courage:.3},{bodyWeights:{strength:.45,durability:.35,endurance:.2},interestWeights:{exertion:.5,care:.3,leadership:.2}});
sub('ABYSSAL_LEVIATHAN_BODY','path:BODY',{discipline:.4,courage:.25},{bodyWeights:{endurance:.5,painTolerance:.3,recoveryRate:.2},interestWeights:{nature:.45,exploration:.3,exertion:.25}});
sub('WAR_DEITY','defend',{courage:.35,ambition:.3},{aptitudeWeights:{command:.18,combat:.12},interestWeights:{leadership:.5,competition:.35,care:.15}});
sub('MERCY_DEITY','social',{empathy:.5,integrity:.3},{valueWeights:{sectDuty:.4,familyClan:.25,honorLegacy:.25},interestWeights:{care:.7,companionship:.3}});
sub('FATE_ORACLE','path:GOD',{rationality:.3,curiosity:.3},{cognitiveWeights:{planning:.35,metacognition:.25,systemsThinking:.4},interestWeights:{analysis:.65,expression:.35}});
sub('TOTEM_BEAST_GOD','path:GOD',{courage:.35,pride:.3},{valueWeights:{familyClan:.4,powerStatus:.3,martialPeak:.2},interestWeights:{nature:.5,leadership:.3,risk:.2}});
sub('UNDERWORLD_JUDGE','path:GOD',{integrity:.5,rationality:.25},{valueWeights:{honorLegacy:.5,sectDuty:.3,powerStatus:.15},interestWeights:{analysis:.35,leadership:.35,care:.3}});
sub('OCEAN_SOVEREIGN','scout',{loyalty:.3,courage:.3},{valueWeights:{sectDuty:.35,freedom:.3,honorLegacy:.2},interestWeights:{nature:.5,exploration:.3,care:.2}});
sub('HARVEST_EARTH_GOD','herb',{empathy:.4,discipline:.3},{valueWeights:{familyClan:.35,sectDuty:.4,honorLegacy:.15},interestWeights:{nature:.55,care:.45}});
sub('HEAVENLY_SCHOLAR_SAGE','path:GOD',{curiosity:.35,integrity:.35,empathy:.2},{valueWeights:{knowledgeCraft:.45,honorLegacy:.35,sectDuty:.2},cognitiveWeights:{verbalComprehension:.4,socialInsight:.25,systemsThinking:.35},interestWeights:{expression:.4,analysis:.3,care:.3}});
const api={VERSION,bodyDefs,cognitiveDefs,interestDefs,parts,partLabels,activities,registerActivity,descriptor,ensure,validate,raw,effective,condition,capacity,liking,clarity,temperature,evaluate,option,movement,travelSpeed,combat,damageMultiplier,recovery,workRate,learningRate,carryLimit,load,harvestLimit,learn,memoryBias,remember,injure,recover,tick,emotions,fingerprint,differences,skill};root.HumanCore=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
