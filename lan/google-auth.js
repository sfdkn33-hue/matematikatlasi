/* Matematik Atlası v6.23 - Google OIDC backend, no Gmail permissions.
 * Pilot: a single Node process and an HTTPS reverse-proxy are required for online login.
 * No OAuth secrets may be stored in GitHub or served as static assets.
 */
'use strict';
const crypto=require('node:crypto');
const AUTH_URL='https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL='https://oauth2.googleapis.com/token';
const JWKS_URL='https://www.googleapis.com/oauth2/v3/certs';
const STATE_TTL=5*60*1000, SESSION_TTL=8*60*60*1000;
const rand=()=>crypto.randomBytes(32).toString('base64url');
const sha=s=>crypto.createHash('sha256').update(s).digest('base64url');
const safeEqual=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.length===b.length&&crypto.timingSafeEqual(Buffer.from(a),Buffer.from(b));
function safeDestination(value){
 if(typeof value!=='string'||value.length>350)return '/kumanda';
 try{const u=new URL(value,'http://atlas.invalid');if(u.origin!=='http://atlas.invalid'||u.pathname!=='/kumanda')return '/kumanda';
 const pair=u.searchParams.get('pair');return pair&&/^[A-Za-z0-9_-]{30,100}$/.test(pair)?'/kumanda?pair='+encodeURIComponent(pair):'/kumanda';}catch{return '/kumanda';}
}
function cookie(req,name){return (req.headers.cookie||'').split(';').map(s=>s.trim()).find(x=>x.startsWith(name+'='))?.slice(name.length+1)||'';}
function cookieString(name,value,options={}){return `${name}=${value}; HttpOnly; SameSite=${options.lax?'Lax':'Strict'}; Path=/; Max-Age=${options.age||0}${options.secure?'; Secure':''}`;}
function reply(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
function redirect(res,url,cookies=[]){res.writeHead(302,{'Location':url,'Cache-Control':'no-store','Referrer-Policy':'no-referrer','Set-Cookie':cookies});res.end();}
function jwtPart(str){const out=Buffer.from(str,'base64url').toString('utf8');return JSON.parse(out);}
function verifyIdToken(idToken,keys,clientId,nonce,clock=Date.now()){
 if(typeof idToken!=='string'||idToken.length>16000)throw Error('id_token invalid');
 const parts=idToken.split('.');if(parts.length!==3)throw Error('JWT format');
 const [h,b,s]=parts,header=jwtPart(h),claims=jwtPart(b);
 if(header.alg!=='RS256'||header.typ&&header.typ!=='JWT'||typeof header.kid!=='string')throw Error('JWT header');
 const key=keys.find(k=>k.kty==='RSA'&&k.use==='sig'&&k.kid===header.kid&&k.alg==='RS256');
 if(!key)throw Error('Unknown Google signing key');
 const pub=crypto.createPublicKey({key,format:'jwk'});
 if(!crypto.verify('RSA-SHA256',Buffer.from(h+'.'+b),pub,Buffer.from(s,'base64url')))throw Error('JWT signature');
 const now=Math.floor(clock/1000);
 if(!['accounts.google.com','https://accounts.google.com'].includes(claims.iss)||claims.aud!==clientId)throw Error('issuer or audience');
 if(!Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.iat)||claims.iat>now+60||claims.iat<now-86400)throw Error('token time');
 if(claims.nbf!==undefined&&( !Number.isFinite(claims.nbf)||claims.nbf>now+60))throw Error('not before');
 if(!safeEqual(claims.nonce,nonce)||typeof claims.sub!=='string'||!claims.sub||claims.email_verified!==true)throw Error('identity or nonce');
 return {sub:claims.sub,email:String(claims.email||'').slice(0,254),name:String(claims.name||'Öğretmen').slice(0,80)};
}
function createGoogleAuth(config=process.env){
 const clientId=config.ATLAS_GOOGLE_CLIENT_ID||'',secret=config.ATLAS_GOOGLE_CLIENT_SECRET||'';
 const origin=(config.ATLAS_PUBLIC_ORIGIN||'').replace(/\/$/,'');
 const enabled=!!(clientId&&secret&&origin);
 const required=config.ATLAS_LOGIN_MODE==='google';
 if(required&&!enabled)throw Error('ATLAS_LOGIN_MODE=google needs ATLAS_PUBLIC_ORIGIN and Google OAuth credentials');
 if(enabled){const u=new URL(origin);if((u.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(u.hostname))||u.pathname!=='/'||u.search||u.hash)throw Error('Google login requires trusted HTTPS public origin');}
 const secure=enabled&&origin.startsWith('https:');
 const pending=new Map(),sessions=new Map();let keyCache=null,keyUntil=0;
 const publicInfo=()=>({enabled,required,redirectUri:enabled?origin+'/auth/google/callback':null,authenticated:false});
 function clean(){const now=Date.now();for(const [k,v] of pending)if(v.until<now)pending.delete(k);for(const [k,v] of sessions)if(v.until<now)sessions.delete(k);}
 const house=setInterval(clean,60000);house.unref();
 function user(req){const id=cookie(req,'atlas623_session');const s=sessions.get(sha(id));return id&&s&&s.until>Date.now()?s.user:null;}
 function logout(req,res){const id=cookie(req,'atlas623_session');if(id)sessions.delete(sha(id));replyWithCookie(res,{ok:true},cookieString('atlas623_session','',{secure,age:0}));}
 function replyWithCookie(res,data,setCookie){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Set-Cookie':setCookie,'X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
 async function fetchJSON(url,opts){const r=await fetch(url,{...opts,signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('Google authentication upstream error');const data=await r.json();return {data,headers:r.headers};}
 async function keys(){if(keyCache&&Date.now()<keyUntil)return keyCache;
 const r=await fetchJSON(JWKS_URL);if(!Array.isArray(r.data.keys))throw Error('Invalid JWKS');keyCache=r.data.keys;
 const maxAge=Number((r.headers.get('cache-control')||'').match(/max-age=(\d+)/)?.[1]||300);
 keyUntil=Date.now()+Math.min(Math.max(maxAge,60),3600)*1000;return keyCache;
 }
 async function handle(req,res,url){
  if(req.method==='GET'&&url.pathname==='/auth/info'){reply(res,200,{...publicInfo(),authenticated:!!user(req)});return true;}
  if(req.method==='GET'&&url.pathname==='/auth/me'){const u=user(req);reply(res,u?200:401,u?{authenticated:true,user:u}:{authenticated:false});return true;}
  if(req.method==='GET'&&url.pathname==='/auth/google/start'){
   if(!enabled){reply(res,503,{error:'Google girişi yapılandırılmadı; yerel PIN kullanılabilir'});return true;}
   if(pending.size>=100){reply(res,429,{error:'Giriş talebi sınırı'});return true;}
   const state=rand(),nonce=rand(),verifier=rand();const returnTo=safeDestination(url.searchParams.get('return_to'));
   pending.set(sha(state),{nonce,verifier,returnTo,until:Date.now()+STATE_TTL});
   const p=new URLSearchParams({client_id:clientId,redirect_uri:origin+'/auth/google/callback',response_type:'code',scope:'openid email profile',state,nonce,code_challenge:sha(verifier),code_challenge_method:'S256'});
   redirect(res,AUTH_URL+'?'+p.toString(),[cookieString('atlas623_oauth',state,{secure,lax:true,age:300})]);return true;
  }
  if(req.method==='GET'&&url.pathname==='/auth/google/callback'){
   const state=url.searchParams.get('state'),code=url.searchParams.get('code');const existing=cookie(req,'atlas623_oauth');
   const entry=state&&pending.get(sha(state));if(state)pending.delete(sha(state));
   if(!enabled||!entry||entry.until<Date.now()||!safeEqual(state,existing)||!code){reply(res,401,{error:'Giriş doğrulaması geçersiz veya süresi dolmuş'});return true;}
   try{
    const form=new URLSearchParams({code,client_id:clientId,client_secret:secret,code_verifier:entry.verifier,redirect_uri:origin+'/auth/google/callback',grant_type:'authorization_code'});
    const token=await fetchJSON(TOKEN_URL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form});
    const identity=verifyIdToken(token.data.id_token,await keys(),clientId,entry.nonce);
    const sid=rand();sessions.set(sha(sid),{user:identity,until:Date.now()+SESSION_TTL});
    redirect(res,entry.returnTo,[cookieString('atlas623_session',sid,{secure,age:SESSION_TTL/1000}),cookieString('atlas623_oauth','',{secure,lax:true,age:0})]);
   }catch(e){reply(res,401,{error:'Google hesabı doğrulanamadı'});}return true;
  }
  return false;
 }
 return {handle,user,enabled,required,secure,logout,publicInfo,verifyIdToken};
}
module.exports={createGoogleAuth,verifyIdToken,safeDestination,cookieString};
