const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root='/mnt/data/atlas_v67_src';
const taskid='MA63-6-01';const DAY=86400000,base=Date.UTC(2026,8,1,12),testResults=[];
function test(name,fn){try{fn();testResults.push({name,pass:true})}catch(e){testResults.push({name,pass:false,error:String(e)});console.error('FAIL',name,e.message)}}
const nodes={};
function el(){return {onclick:null,hidden:true,focus(){},value:'6',addEventListener(){},appendChild(){},replaceChildren(){},setAttribute(){},querySelectorAll(){return []},classList:{add(){},remove(){}}}}
const ids=['atlas64Dashboard','atlas64Body','atlas64Grade','atlas64OpenHome','atlas64OpenTask','atlas64Close','atlas64Refresh','grade'];for(const id of ids)nodes[id]=el();
let memory={};let failStorage=false;const failures=[];
const storage={getItem:k=>memory[k]||null,setItem(k,v){if(failStorage)throw new Error('QuotaExceededError');memory[k]=String(v)},removeItem(k){delete memory[k]}};
const db={tasks:[{id:taskid,atlas63Pilot:{family:'test'},ogrenme_ciktisi:'M.6',sinif:6}],outcomes:[{kod:'M.6',sinif:6,etiket:'test'}]};
const ctx={window:null,document:{getElementById:id=>nodes[id]||null,addEventListener(){},dispatchEvent:e=>failures.push(e.type)},localStorage:storage,console,Date,Map,Set,Number,String,JSON,Math,Object,Array,CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts?.detail||{}}}};
ctx.window=ctx;ctx.ATLAS_DB=db;vm.createContext(ctx);vm.runInContext(fs.readFileSync(root+'/assets/js/atlas64_progress.js','utf8'),ctx);
function ev(day,opts={}){return {taskId:taskid,status:opts.status||'correct',when:base+day*DAY+(opts.h||0)*3600000,firstTry:opts.firstTry??true,hintUsed:opts.hintUsed||false,wrongCount:opts.wrongCount||0}}
function calc(events,day){memory.mathAtlas64Attempts=JSON.stringify(events);ctx.__atlas64TestNow=base+day*DAY+3*3600000;return ctx.MatematikAtlas64.calculate(taskid)}
function case1(name,events,day,phase,steps){test(name,()=>{const x=calc(events,day);assert.equal(x.phase,phase,JSON.stringify(x));assert.equal(x.steps,steps,JSON.stringify(x))})}
case1('never attempted',[],1,'notStarted',0);
case1('initial success',[ev(0)],0,'scheduled',0);
case1('premature same day',[ev(0),ev(0,{h:2})],0,'scheduled',0);
case1('day 1 due',[ev(0)],1,'due',0);
case1('day 1 passed',[ev(0),ev(1)],1,'scheduled',1);
case1('day 6 not due',[ev(0),ev(1)],6,'scheduled',1);
case1('day 7 due',[ev(0),ev(1)],7,'due',1);
case1('day 7 passed',[ev(0),ev(1),ev(7)],7,'scheduled',2);
case1('day 20 not due',[ev(0),ev(1),ev(7)],20,'scheduled',2);
case1('day 21 due',[ev(0),ev(1),ev(7)],21,'due',2);
case1('day 21 passed',[ev(0),ev(1),ev(7),ev(21)],22,'complete',3);
case1('3 repeats at day22 cannot complete',[ev(0),ev(22,{h:-4}),ev(22,{h:-3}),ev(22,{h:-2})],23,'scheduled',1);
case1('late adjacent days cannot fast track',[ev(0),ev(22),ev(23),ev(24)],25,'scheduled',1);
case1('late but genuinely spaced days',[ev(0),ev(22),ev(28),ev(42)],43,'complete',3);
case1('wrong repeat not accepted',[ev(0),ev(1,{status:'wrong'}),ev(1,{firstTry:false,wrongCount:1})],2,'due',0);
case1('hinted repeat not accepted',[ev(0),ev(1,{hintUsed:true})],2,'due',0);
case1('consecutive same day not second step',[ev(0),ev(1),ev(1,{h:1}),ev(7)],7,'scheduled',2);
case1('premature step2 not counted',[ev(0),ev(1),ev(3)],7,'due',1);
case1('future clock anomaly',[ev(0),ev(30)],5,'clockWarning',0);
case1('old completed without history no mastery',[],100,'notStarted',0);
case1('out-of-order events sorted',[ev(7),ev(0),ev(1)],9,'scheduled',2);
case1('duplicate initial success same day no credit',[ev(0),ev(0,{h:1}),ev(0,{h:2})],2,'due',0);
case1('backward time excludes future events',[ev(0),ev(5)],1,'clockWarning',0);
test('history bound write',()=>{memory.mathAtlas64Attempts='[]';ctx.__atlas64TestNow=base;ctx.MatematikAtlas64.log({taskId:taskid,status:'correct'});assert.equal(JSON.parse(memory.mathAtlas64Attempts).length,1)});
test('persist write failure emits warning',()=>{failStorage=true;ctx.MatematikAtlas64.log({taskId:taskid,status:'correct'});assert(failures.includes('atlas:storagefailure'));failStorage=false});
const summary={total:testResults.length,passed:testResults.filter(x=>x.pass).length,failures:testResults.filter(x=>!x.pass),tests:testResults};fs.mkdirSync(root+'/tests',{recursive:true});fs.writeFileSync(root+'/tests/QA_V67_ALGORITHM.json',JSON.stringify(summary,null,2));console.log(JSON.stringify({total:summary.total,passed:summary.passed,failures:summary.failures},null,2));if(summary.failures.length)process.exitCode=1;
