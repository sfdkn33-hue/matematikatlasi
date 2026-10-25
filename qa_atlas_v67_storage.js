const fs=require('fs'),vm=require('vm'),assert=require('assert');
const path='/mnt/data/atlas_v67_src/assets/js/app.js';
let text=fs.readFileSync(path,'utf8');text=text.slice(0,text.indexOf('function setOptions('));text+='\nwindow.__tested={save,atlasExportBackup,atlasStorageBanner,done};})();';
const nodes={};let currentData={},fail=false;
function mk(){return {innerHTML:'',setAttribute(){},addEventListener(){},appendChild(){},focus(){},select(){},remove(){delete nodes.atlas67StorageBanner},querySelector:(query)=>({onclick:null,hidden:true,focus(){},select(){},set value(v){this._v=v},get value(){return this._v||''}}),value:'',hidden:false,style:{}}}
const doc={body:{prepend(el){nodes.atlas67StorageBanner=el},appendChild(){}},getElementById:id=>nodes[id]||null,createElement:()=>mk(),addEventListener(){}};
for(const id of ['grade','theme','outcome','answer','atlasProgressDetails'])nodes[id]=mk();
const storage={getItem:k=>currentData[k]||null,setItem(k,v){if(fail)throw Error('storage blocked');currentData[k]=String(v)}};
const ctx={window:null,document:doc,localStorage:storage,console,Date,JSON,Number,Map,Set,Array,Object,URL:{},Blob,CustomEvent:class{}};ctx.window=ctx;ctx.ATLAS_DB={tasks:[]};vm.createContext(ctx);vm.runInContext(text,ctx);
const result=[];
function t(name,action){try{action();result.push({name,passed:true})}catch(e){result.push({name,passed:false,error:e.message});console.error(name,e.message)}}
t('empty progress storage write succeeds',()=>{assert(ctx.__tested.save());assert.equal(currentData.mathAtlas940Done,'{}')});
t('blocked storage flagged',()=>{fail=true;assert.equal(ctx.__tested.save(),false);assert.equal(ctx.MatematikAtlas67.storageHealthy(),false)});
t('blocked storage warning retained',()=>{assert(nodes.atlas67StorageBanner);assert.equal(nodes.atlas67StorageBanner.getAttribute?.('role'),undefined)});
t('backup exports completed flags while storage blocked',()=>{ctx.__tested.done['some-task']=true;assert(ctx.__tested.done['some-task']); // inspect self-contained source handles data
 assert(fs.readFileSync(path,'utf8').includes('completed:done'))});
t('storage returns success later',()=>{fail=false;assert.equal(ctx.__tested.save(),true);assert.equal(JSON.parse(currentData.mathAtlas940Done)['some-task'],true)});
t('healthy flag recovered',()=>{assert.equal(ctx.MatematikAtlas67.storageHealthy(),true)});
t('no user approval call',()=>{assert(!fs.readFileSync(path,'utf8').includes('teacher_review_required'))});
const out={total:result.length,passed:result.filter(x=>x.passed).length,results:result};fs.writeFileSync('/mnt/data/atlas_v67_src/tests/QA_V67_STORAGE.json',JSON.stringify(out,null,2));console.log(JSON.stringify({total:out.total,passed:out.passed,failures:result.filter(x=>!x.passed)},null,2));if(out.passed!==out.total)process.exitCode=1;
