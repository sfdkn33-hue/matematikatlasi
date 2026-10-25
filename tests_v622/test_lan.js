'use strict';
const assert=require('node:assert/strict');const {server,taskSet}=require('../lan/server');const http=require('node:http');
const results=[];async function run(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port,base='http://127.0.0.1:'+port,origin=base;
 const post=async(uri,body={},cookie='',extra={})=>{const r=await fetch(base+uri,{method:'POST',headers:{origin,'Content-Type':'application/json',...(cookie?{cookie}:{}),...extra},body:JSON.stringify(body)});return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]||''};};
 const get=async(uri,cookie='')=>{const r=await fetch(base+uri,{headers:cookie?{cookie}:{}});return{status:r.status,body:await r.json()}};
 const check=(label,condition)=>{results.push({label,passed:!!condition});assert.ok(condition,label)};
 try{
  let health=await get('/api/health');check('server health',health.status===200&&health.body.version==='6.23');
  const denied=await get('/api/catalog');check('catalog requires teacher login',denied.status===401);
  const created=await post('/api/room');const boardCookie=created.cookie;
  check('random pairing room',created.status===201&&/^[A-Z2-9]{6}$/.test(created.body.code)&&/^\d{6}$/.test(created.body.pin)&&boardCookie.startsWith('atlas622_board='));
  check('board session preserved', (await get('/api/session?role=board',boardCookie)).body.pin===created.body.pin);
  const invalidPin=await post('/api/join',{code:created.body.code,pin:'000000'});check('wrong PIN rejected',invalidPin.status===401);
  const join=await post('/api/join',{code:created.body.code,pin:created.body.pin});const teacherCookie=join.cookie;check('valid teacher paired',join.status===200&&teacherCookie.startsWith('atlas622_teacher='));
  const other=await post('/api/join',{code:created.body.code,pin:created.body.pin});check('second teacher rejected',other.status===409);
  const catalog=await get('/api/catalog',teacherCookie);check('4037 tasks available for navigation',catalog.status===200&&catalog.body.tasks.length===4037&&taskSet.size===4037);
  const sample=catalog.body.tasks[232];const selection=await post('/api/command',{action:'select',taskId:sample.id},teacherCookie);
  check('teacher can navigate valid task',selection.status===200&&selection.body.queued);
  check('unauthorized command rejected',(await post('/api/command',{action:'next'})).status===401);
  check('grading command forbidden',(await post('/api/command',{action:'correct'},teacherCookie)).status===400);
  check('unknown task forbidden',(await post('/api/command',{action:'select',taskId:'not-an-id'},teacherCookie)).status===400);
  const state=await post('/api/board/state',{taskId:sample.id},boardCookie);
  check('only board may update task state',state.status===200&&(await get('/api/session?role=teacher',teacherCookie)).body.taskId===sample.id);
  check('teacher cannot forge board state',(await post('/api/board/state',{taskId:sample.id},teacherCookie)).status===401);
  const attack=await fetch(base+'/api/command',{method:'POST',headers:{origin:'http://evil.example','Content-Type':'application/json',cookie:teacherCookie},body:JSON.stringify({action:'next'})});check('cross-origin POST rejected',attack.status===403);await attack.text();
  const ends=await post('/api/room/end',{},boardCookie);check('board can revoke session',ends.status===200&&(await post('/api/command',{action:'next'},teacherCookie)).status===401);
  check('room revoked',(await get('/api/session?role=board',boardCookie)).body.active===false);
  // EventSource-like API smoke test: send and receive commands with authentication
  const cr=await post('/api/room');const bj=cr.cookie;const jr=await post('/api/join',{code:cr.body.code,pin:cr.body.pin});const tj=jr.cookie;
  const got=[];
  const active=await new Promise((resolve,reject)=>{
   const req=http.get(base+'/api/events?role=board',{headers:{Cookie:bj}},res=>{res.on('data',chunk=>{got.push(chunk.toString());if(got.join('').includes('event: state'))resolve({req,res});});res.on('error',reject);});req.on('error',reject);
  });
  await post('/api/command',{action:'next'},tj);await new Promise(r=>setTimeout(r,120));
  check('SSE realtime command delivered',got.join('').includes('event: command')&&got.join('').includes('"action":"next"'));
  active.req.destroy();active.res.destroy();await post('/api/room/end',{},bj);
 }finally{await new Promise(r=>server.close(r));}
 console.log(JSON.stringify({passed:results.filter(x=>x.passed).length,total:results.length,tests:results},null,2));
}
run().catch(e=>{console.error(e);process.exitCode=1});
