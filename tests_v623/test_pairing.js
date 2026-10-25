'use strict';
const assert=require('node:assert/strict');
const {server,taskSet,pairing}=require('../lan/server');
const count={passed:0};
function check(label,condition){assert.ok(condition,label);count.passed++;}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 async function post(path,body={},cookie='',origin=base){const r=await fetch(base+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)});return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')||''};}
 async function get(path,cookie=''){const r=await fetch(base+path,{headers:cookie?{Cookie:cookie}:{}});return {status:r.status,body:await r.json(),cookies:r.headers.getSetCookie?.()||[]};}
 const justCookie=s=>s.split(';')[0];
 try{
  const health=await get('/api/health');check('v6.23 API active',health.status===200&&health.body.version==='6.23');
  check('original 4037 ids stay intact',taskSet.size===4037);
  const room=await post('/api/room');const board=justCookie(room.cookie);check('room opens unchanged',room.status===201&&board.startsWith('atlas622_board='));
  check('non-board cannot create QR',(await post('/api/pair/prepare')).status===401);
  const prepared=await post('/api/pair/prepare',{},board);
  const url=new URL(prepared.body.pairingUrl),token=url.searchParams.get('pair');
  check('QR is short-lived and contains no PIN',prepared.status===200&&/^[A-Za-z0-9_-]{32}$/.test(token)&&!prepared.body.pairingUrl.includes(room.body.pin)&&prepared.body.expires>Date.now());
  check('different website cannot create QR',(await post('/api/pair/prepare',{},board,'http://attacker.example')).status===403);
  const outsider=await post('/api/pair/claim',{token:'AAA'});check('invalid pairing token refused',outsider.status===400);
  const claim=await post('/api/pair/claim',{token});const proof=justCookie(claim.cookie);
  check('valid QR only gives a pending request',claim.status===200&&claim.body.pending&&proof.startsWith('atlas623_pair='));
  check('QR replay prohibited',(await post('/api/pair/claim',{token})).status===410);
  check('unapproved QR cannot control board',(await post('/api/command',{action:'next'},proof)).status===401);
  check('pending claim visible only to board',(await get('/api/pair/requests')).status===401);
  const requests=await get('/api/pair/requests',board);check('board sees request without student data',requests.body.requests.length===1&&requests.body.requests[0].name==='Yerel öğretmen cihazı');
  check('outsider cannot approve',(await post('/api/pair/approve',{id:requests.body.requests[0].id})).status===401);
  const accept=await post('/api/pair/approve',{id:requests.body.requests[0].id},board);check('only board approves',accept.status===200&&accept.body.approved);
  const approved=await get('/api/pair/status',proof);const teacher=approved.cookies.find(s=>s.startsWith('atlas622_teacher='))?.split(';')[0];
  check('teacher receives authority after explicit confirmation',approved.status===200&&approved.body.approved&&!!teacher);
  check('pairing proof cannot be redeemed twice',(await get('/api/pair/status',proof)).status===401);
  check('teacher can now navigate',(await post('/api/command',{action:'next'},teacher)).status===200);
  check('teacher cannot mark tasks correct',(await post('/api/command',{action:'correct'},teacher)).status===400);
  const end=await post('/api/room/end',{},board);check('board can terminate session',end.status===200);
  check('teacher is revoked on session end',(await post('/api/command',{action:'next'},teacher)).status===401);
  const r2=await post('/api/room');const b2=justCookie(r2.cookie);const t2=new URL((await post('/api/pair/prepare',{},b2)).body.pairingUrl).searchParams.get('pair');
  const c2=await post('/api/pair/claim',{token:t2});const p2=justCookie(c2.cookie),rq2=await get('/api/pair/requests',b2);
  const denied=await post('/api/pair/reject',{id:rq2.body.requests[0].id},b2);check('board may reject',denied.body.approved===false);
  check('rejected pairing cannot get teacher cookie',(await get('/api/pair/status',p2)).status===410);
  check('invalid original PIN still rejected',(await post('/api/join',{code:r2.body.code,pin:'000000'})).status===401);
  const fresh=await post('/api/pair/prepare',{},b2);const t3=new URL(fresh.body.pairingUrl).searchParams.get('pair');
  pairing._test.tokens.get(require('node:crypto').createHash('sha256').update(t3).digest('hex')).expires=Date.now()-1;
  check('expired QR refused',(await post('/api/pair/claim',{token:t3})).status===410);
  await post('/api/room/end',{},b2);
  console.log('v6.23 QR integration tests: '+count.passed+'/'+count.passed+' passed');
 }finally{await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
