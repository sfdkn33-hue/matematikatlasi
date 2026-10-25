/* Matematik Atlası v6.22 · LAN-only class session prototype
   No dependencies.  Node >=18.  No student names, answers or progress data are transmitted. */
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os');
const {createGoogleAuth,cookieString}=require('./google-auth');
const {createQrPairing}=require('./qr-pairing');
const auth=createGoogleAuth();
const ROOT=path.resolve(__dirname,'..');
const BIND=process.env.ATLAS_HOST||'0.0.0.0';
const PORT=Number(process.env.ATLAS_PORT||8765);
const TTL=2*60*60*1000;
const rooms=new Map(),attempts=new Map();
const tasks=JSON.parse(fs.readFileSync(path.join(ROOT,'data','tasks.json'),'utf8')).tasks;
const taskSet=new Set(tasks.map(t=>String(t.id)));
const catalog=tasks.map(t=>({id:String(t.id),grade:Number(t.sinif),outcome:String(t.ogrenme_ciktisi||''),title:String(t.baslik||'').slice(0,150),number:Number(t.gorev_no)||0}));
const rand=(n=20)=>crypto.randomBytes(n).toString('hex');
const text=(res,code,data,type='application/json; charset=utf-8',headers={})=>{res.writeHead(code,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"frame-ancestors 'self'",...headers});res.end(typeof data==='string'?data:JSON.stringify(data));};
const json=(res,code,data,headers)=>text(res,code,data,'application/json; charset=utf-8',headers);
function cookies(req){const o={};(req.headers.cookie||'').split(';').forEach(c=>{const at=c.indexOf('=');if(at>0)o[c.slice(0,at).trim()]=c.slice(at+1).trim()});return o;}
function getRoom(req,role){const token=cookies(req)['atlas622_'+role];if(!token)return null;for(const room of rooms.values())if(room[role+'Token']===token&&room.expires>Date.now()){if(role==='teacher'&&auth.required&&(!auth.user(req)||auth.user(req).sub!==room.teacherSub))return null;return room;}return null;}
function allowedOrigin(req){const origin=req.headers.origin;if(!origin)return false;try{const u=new URL(origin);const configured=process.env.ATLAS_PUBLIC_ORIGIN?.replace(/\/$/,'');return configured?u.origin===configured:(u.host===req.headers.host&&['http:','https:'].includes(u.protocol));}catch{return false;}}
function sendEvent(res,event,obj){try{res.write('event: '+event+'\ndata: '+JSON.stringify(obj)+'\n\n');}catch{}}
function signal(room,event,obj,role){for(const c of room.clients){if(!role||c.role===role)sendEvent(c.res,event,obj);}}
function info(room){return {code:room.code,connected:room.teacherJoined,boardOnline:room.boardOnline,taskId:room.taskId||null,expires:room.expires};}
function removeRoom(room){pairing.roomEnded(room.code);rooms.delete(room.code);signal(room,'ended',{message:'Oturum kapatıldı'});for(const c of room.clients){try{c.res.end();}catch{}}room.clients.clear();}
function cleanup(){for(const room of rooms.values())if(room.expires<=Date.now())removeRoom(room);for(const [k,a] of attempts)if(a.until+600000<Date.now())attempts.delete(k);}
const housekeeping=setInterval(cleanup,60000);housekeeping.unref();
async function readBody(req){const parts=[];let sz=0;for await(const chunk of req){sz+=chunk.length;if(sz>16*1024)throw Object.assign(Error('İstek fazla büyük'),{status:413});parts.push(chunk);}return JSON.parse(Buffer.concat(parts).toString('utf8')||'{}');}
function validPost(req,res){if(req.headers['content-type']?.split(';')[0]!=='application/json'||!allowedOrigin(req)){json(res,403,{error:'İstek kaynağı veya içerik türü geçersiz'});return false;}return true;}
function sanitizeCode(v){return typeof v==='string'&&/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(v);}
function ipAddress(req){return String(req.socket.remoteAddress||'?');}
const mimes={'.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.jpg':'image/jpeg','.jpeg':'image/jpeg','.html':'text/html; charset=utf-8'};
function staticFile(res,file){fs.stat(file,(err,st)=>{if(err||!st.isFile())return json(res,404,{error:'Dosya bulunamadı'});const type=mimes[path.extname(file).toLowerCase()]||'application/octet-stream';res.writeHead(200,{'Content-Type':type,'Content-Length':st.size,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);});}
const pairing=createQrPairing({rooms,getRoom,info,signal,auth,cookieString,publicOrigin:process.env.ATLAS_PUBLIC_ORIGIN?.replace(/\/$/,'')});
const teacherHtml=fs.readFileSync(path.join(__dirname,'teacher.html'),'utf8');
const boardHtml=fs.readFileSync(path.join(ROOT,'index.html'),'utf8').replace('</head>','<link rel="stylesheet" href="/lan/board.css"></head>').replace('</body>','<script defer src="/lan/board.js"></script></body>');
const server=http.createServer(async(req,res)=>{
 try{
 const u=new URL(req.url,'http://localhost');const url=u.pathname;
 if(await auth.handle(req,res,u))return;
 if(req.method==='GET'&&url==='/'){return text(res,200,'<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Atlas Sınıf</title><body style="font:18px system-ui;max-width:680px;margin:48px auto;padding:20px"><h1>🎮 Matematik Atlası v6.22</h1><p>Telefon ve tahta aynı yerel ağa bağlı olmalıdır.</p><p><a href="/tahta">📺 Tahtayı aç</a></p><p><a href="/kumanda">📱 Öğretmen kumandasını aç</a></p><p>Öğrenci yanıtları bu sunucuya gönderilmez.</p></body></html>','text/html; charset=utf-8');}
 if(req.method==='GET'&&url==='/tahta')return text(res,200,boardHtml,'text/html; charset=utf-8');
 if(req.method==='GET'&&url==='/kumanda')return text(res,200,teacherHtml,'text/html; charset=utf-8');
 if(req.method==='GET'&&url==='/api/health')return json(res,200,{ok:true,version:'6.23',googleConfigured:auth.enabled});
 if(req.method==='GET'&&url==='/api/pair/requests')return pairing.requests(req,res);
 if(req.method==='GET'&&url==='/api/pair/status')return pairing.status(req,res);
 if(req.method==='GET'&&url==='/api/catalog'){
  if(!getRoom(req,'teacher'))return json(res,401,{error:'Öğretmen bağlantısı gerekli'});
  return json(res,200,{tasks:catalog});
 }
 if(req.method==='GET'&&url==='/api/session'){
  const role=u.searchParams.get('role');if(role!=='board'&&role!=='teacher')return json(res,400,{error:'Rol geçersiz'});
  const room=getRoom(req,role);return json(res,200,room?{active:true,role,...info(room),...(role==='board'?{pin:room.pin}:{})}:{active:false});
 }
 if(req.method==='GET'&&url==='/api/events'){
  const role=u.searchParams.get('role');if(!['teacher','board'].includes(role))return json(res,400,{error:'Rol geçersiz'});
  const room=getRoom(req,role);if(!room)return json(res,401,{error:'Bağlantı yetkisi yok'});
  res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-store','Connection':'keep-alive','X-Accel-Buffering':'no','X-Content-Type-Options':'nosniff'});
  const client={role,res};room.clients.add(client);
  if(role==='board'){room.boardOnline=true;signal(room,'state',info(room),'teacher');}
  sendEvent(res,'state',info(room));const keep=setInterval(()=>{try{res.write(': ping\n\n');}catch{}},20000);
  req.on('close',()=>{clearInterval(keep);room.clients.delete(client);if(role==='board'){room.boardOnline=[...room.clients].some(c=>c.role==='board');signal(room,'state',info(room),'teacher');}});return;
 }
 if(req.method==='POST'){
  if(!validPost(req,res))return;
  const body=await readBody(req);
  if(url==='/auth/logout')return auth.logout(req,res);
  if(url==='/api/pair/prepare')return pairing.prepare(req,res);
  if(url==='/api/pair/claim')return pairing.claim(req,res,body);
  if(url==='/api/pair/approve')return pairing.decide(req,res,body,true);
  if(url==='/api/pair/reject')return pairing.decide(req,res,body,false);
  if(url==='/api/room'){
   if(rooms.size>=20)return json(res,429,{error:'Aynı anda en fazla 20 pilot sınıf oturumu açılabilir'});
   const old=getRoom(req,'board');if(old)return json(res,409,{error:'Önce mevcut oturumu kapatın'});
   let code;do{code=[...crypto.randomBytes(6)].map(n=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n%32]).join('')}while(rooms.has(code));
   const room={code,pin:String(crypto.randomInt(100000,1000000)),boardToken:rand(),teacherToken:rand(),teacherJoined:false,boardOnline:false,clients:new Set(),taskId:null,expires:Date.now()+TTL};rooms.set(code,room);
   return json(res,201,{code,pin:room.pin,expires:room.expires},{'Set-Cookie':cookieString('atlas622_board',room.boardToken,{secure:auth.secure,age:7200})});
  }
  if(url==='/api/join'){
   if(auth.required&&!auth.user(req))return json(res,401,{error:'Öğretmen Google girişi gerekli'});
   const address=ipAddress(req);const now=Date.now();const attempt=attempts.get(address)||{count:0,until:now+10*60*1000};
   if(now>attempt.until){attempt.count=0;attempt.until=now+10*60*1000;}if(attempt.count>=8)return json(res,429,{error:'Çok sayıda hatalı giriş. 10 dakika sonra yeniden deneyin.'});
   if(!sanitizeCode(body.code)||!/^[0-9]{6}$/.test(String(body.pin||''))){attempt.count++;attempts.set(address,attempt);return json(res,400,{error:'Kod veya PIN hatalı'});}
   const room=rooms.get(body.code);
   if(!room||room.pin!==String(body.pin)||room.expires<=now){attempt.count++;attempts.set(address,attempt);return json(res,401,{error:'Kod veya PIN hatalı'});}
   if(room.teacherJoined)return json(res,409,{error:'Bu oturuma bir öğretmen zaten bağlandı'});
   attempts.delete(address);room.teacherJoined=true;room.teacherSub=auth.user(req)?.sub||null;signal(room,'state',info(room),'board');
   return json(res,200,{active:true,...info(room)},{'Set-Cookie':cookieString('atlas622_teacher',room.teacherToken,{secure:auth.secure,age:7200})});
  }
  if(url==='/api/command'){
   const room=getRoom(req,'teacher');if(!room)return json(res,401,{error:'Yetki yok'});
   const cmd=String(body.action||'');if(!['next','prev','select','home'].includes(cmd))return json(res,400,{error:'Komut geçersiz'});
   if(cmd==='select'&&(!taskSet.has(String(body.taskId||''))))return json(res,400,{error:'Görev kimliği geçersiz'});
   const event={action:cmd,...(cmd==='select'?{taskId:String(body.taskId)}:{}),seq:rand(6)};
   signal(room,'command',event,'board');return json(res,200,{queued:true,boardOnline:room.boardOnline});
  }
  if(url==='/api/board/state'){
   const room=getRoom(req,'board');if(!room)return json(res,401,{error:'Yetki yok'});
   const id=String(body.taskId||'');if(id&&!taskSet.has(id))return json(res,400,{error:'Görev kimliği geçersiz'});
   room.taskId=id||null;signal(room,'state',info(room),'teacher');return json(res,200,{ok:true});
  }
  if(url==='/api/room/end'){
   const room=getRoom(req,'board');if(!room)return json(res,401,{error:'Yalnız tahta oturumu bitirebilir'});
   removeRoom(room);return json(res,200,{ended:true},{'Set-Cookie':cookieString('atlas622_board','',{secure:auth.secure,age:0})});
  }
  return json(res,404,{error:'API bulunamadı'});
 }
 if(req.method==='GET'&&(url.startsWith('/assets/')||url.startsWith('/data/')||url.startsWith('/lan/'))){
  const normalized=path.resolve(ROOT,'.'+decodeURIComponent(url));if(!normalized.startsWith(ROOT+path.sep))return json(res,403,{error:'Erişim yok'});
  const ext=path.extname(normalized).toLowerCase();if(!mimes[ext]||ext==='.html'||url.startsWith('/lan/')&&!['/lan/board.js','/lan/board.css'].includes(url))return json(res,403,{error:'İzin verilmeyen dosya'});
  return staticFile(res,normalized);
 }
 return json(res,404,{error:'Sayfa bulunamadı'});
 }catch(e){return json(res,e.status||400,{error:'İstek işlenemedi'});}
});
if(require.main===module){server.listen(PORT,BIND,()=>{
 console.log('\n🎮 Matematik Atlası v6.22 LAN prototipi');console.log('Yerel: http://127.0.0.1:'+PORT+'/tahta');
 for(const iface of Object.values(os.networkInterfaces()))for(const it of iface||[])if(it.family==='IPv4'&&!it.internal)console.log('Aynı ağdaki telefon: http://'+it.address+':'+PORT+'/kumanda');
 console.log('Yalnız güvenilen okul/ev yerel ağında kullanın. Oturum 2 saatte sona erer.\n');
});}
module.exports={server,rooms,taskSet,auth,pairing};
