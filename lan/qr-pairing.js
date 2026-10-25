/* v6.23 QR pairing: the QR holds a transient claim URL, not a teacher access key.
   Teacher cannot send commands until the board confirms the claim. */
'use strict';
const crypto=require('node:crypto'),os=require('node:os');
const KEY_TTL=120000, CLAIM_TTL=120000;
const random=()=>crypto.randomBytes(24).toString('base64url');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
function extractCookie(req,name){return (req.headers.cookie||'').split(';').map(s=>s.trim()).find(x=>x.startsWith(name+'='))?.slice(name.length+1)||'';}
function createQrPairing({rooms,getRoom,info,signal,auth,cookieString,publicOrigin}){
 const tokens=new Map(),claims=new Map();
 const reject=(res,code,error)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify({error}));};
 const ok=(res,body,headers={})=>{res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(body));};
 function cleanup(){const now=Date.now();for(const [k,t] of tokens)if(t.expires<now||!rooms.has(t.room))tokens.delete(k);for(const [k,c] of claims)if(c.expires<now||!rooms.has(c.room)){if(c.state==='approved'){const room=rooms.get(c.room);if(room){room.teacherJoined=false;room.teacherSub=null;signal(room,'state',info(room),'board');}}claims.delete(k);}}
 const timer=setInterval(cleanup,30000);timer.unref();
 function origin(req){
  if(publicOrigin)return publicOrigin;
  if(process.env.ATLAS_PAIRING_ORIGIN){const u=new URL(process.env.ATLAS_PAIRING_ORIGIN);if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.pathname!=='/'||u.search||u.hash)throw Error('ATLAS_PAIRING_ORIGIN must be a bare trusted origin');return u.origin;}
  try{const u=new URL('http://'+req.headers.host);if(u.username||u.password)throw 0;
   if(['localhost','127.0.0.1','::1','[::1]'].includes(u.hostname)){
    // localhost on the board would point at the PHONE itself; advertise a local LAN address.
    const candidates=Object.values(os.networkInterfaces()).flatMap(items=>items||[]).filter(x=>x.family==='IPv4'&&!x.internal&&/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(x.address));
    if(candidates.length===1)u.hostname=candidates[0].address;
    // On multiple network adapters, set ATLAS_PAIRING_ORIGIN to the classroom LAN URL.
   }
   return u.origin;
  }catch{return 'http://127.0.0.1:8765';}
 }
 function pending(room){return [...claims.values()].filter(c=>c.room===room.code&&c.state==='pending'&&c.expires>Date.now()).map(c=>({id:c.id,name:c.name,expires:c.expires}));}
 function prepare(req,res){const room=getRoom(req,'board');if(!room)return reject(res,401,'Tahta oturumu gerekli');if(room.teacherJoined)return reject(res,409,'Öğretmen zaten bağlı');
 for(const [key,t] of tokens)if(t.room===room.code)tokens.delete(key);
 const token=random(),expires=Date.now()+KEY_TTL;tokens.set(hash(token),{room:room.code,expires});
 ok(res,{expires,pairingUrl:origin(req)+'/kumanda?pair='+encodeURIComponent(token),requiresBoardApproval:true,googleLoginAvailable:auth.enabled});
 }
 function claim(req,res,body){const token=body?.token;
 if(typeof token!=='string'||!/^[A-Za-z0-9_-]{32}$/.test(token))return reject(res,400,'Karekod geçersiz');
 if(auth.required&&!auth.user(req))return reject(res,401,'Öğretmen Google girişi gerekli');
 const key=hash(token),entry=tokens.get(key);tokens.delete(key);
 if(!entry||entry.expires<Date.now())return reject(res,410,'Karekod kullanılmış veya süresi dolmuş');
 const room=rooms.get(entry.room);if(!room||room.teacherJoined)return reject(res,409,'Sınıf oturumu kullanılamıyor');
 for(const c of claims.values())if(c.room===room.code&&c.state==='pending')return reject(res,409,'Önce bekleyen eşleştirme onaylanmalı');
 const id=random(),proof=random(),identity=auth.user(req);
 claims.set(hash(proof),{id,proofHash:hash(proof),room:room.code,name:identity?.name||'Yerel öğretmen cihazı',userSub:identity?.sub||null,expires:Date.now()+CLAIM_TTL,state:'pending'});
 signal(room,'pair-request',{id,name:identity?.name||'Yerel öğretmen cihazı',expires:Date.now()+CLAIM_TTL},'board');
 ok(res,{pending:true,requiresBoardApproval:true,expires:Date.now()+CLAIM_TTL},{'Set-Cookie':cookieString('atlas623_pair',proof,{secure:auth.secure,age:120})});
 }
 function requests(req,res){const room=getRoom(req,'board');if(!room)return reject(res,401,'Tahta yetkisi gerekli');return ok(res,{requests:pending(room)});}
 function decide(req,res,body,approve){const room=getRoom(req,'board');if(!room)return reject(res,401,'Tahta yetkisi gerekli');
 const c=[...claims.values()].find(x=>x.id===body?.id&&x.room===room.code);
 if(!c||c.state!=='pending'||c.expires<Date.now())return reject(res,404,'Bekleyen istek bulunamadı');
 if(approve&&room.teacherJoined)return reject(res,409,'Öğretmen zaten eşleşmiş');
 c.state=approve?'approved':'rejected';if(approve){room.teacherJoined=true;room.teacherSub=c.userSub;}signal(room,'state',info(room),'board');
 return ok(res,{approved:approve});
 }
 function status(req,res){const proof=extractCookie(req,'atlas623_pair');const c=claims.get(hash(proof));
 if(!proof||!c)return reject(res,401,'Eşleştirme isteği bulunamadı');
 if(c.expires<Date.now()||c.state==='rejected')return reject(res,410,'Eşleştirme süresi doldu veya reddedildi');
 if(auth.required&&(!auth.user(req)||auth.user(req).sub!==c.userSub))return reject(res,401,'Google oturumu geçersiz');
 if(c.state==='pending')return ok(res,{pending:true,approved:false});
 const room=rooms.get(c.room);if(!room||!room.teacherJoined||room.expires<Date.now())return reject(res,410,'Sınıf oturumu kapatıldı');
 claims.delete(hash(proof));
 return ok(res,{pending:false,approved:true,...info(room)},{'Set-Cookie':[cookieString('atlas622_teacher',room.teacherToken,{secure:auth.secure,age:Math.max(1,Math.floor((room.expires-Date.now())/1000))}),cookieString('atlas623_pair','',{secure:auth.secure,age:0})]});
 }
 function roomEnded(code){for(const [k,v] of tokens)if(v.room===code)tokens.delete(k);for(const [k,v] of claims)if(v.room===code)claims.delete(k);}
 return {prepare,claim,requests,decide,status,roomEnded,_test:{tokens,claims}};
}
module.exports={createQrPairing};
