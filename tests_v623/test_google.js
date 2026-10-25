'use strict';
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {createGoogleAuth,verifyIdToken,safeDestination}=require('../lan/google-auth');
let passed=0;const check=(name,ok)=>{assert.ok(ok,name);passed++};
const {privateKey,publicKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
const key=publicKey.export({format:'jwk'});Object.assign(key,{kid:'test-key',kty:'RSA',use:'sig',alg:'RS256'});
const clientId='sample-client.apps.googleusercontent.com',nonce='an-expected-nonce';
const now=Math.floor(Date.now()/1000);
function jwt(changes={},keyToSign=privateKey){const head=Buffer.from(JSON.stringify({typ:'JWT',alg:'RS256',kid:'test-key'})).toString('base64url');const body=Buffer.from(JSON.stringify({iss:'https://accounts.google.com',aud:clientId,sub:'teacher-google-sub',email:'teacher@example.com',email_verified:true,nonce,iat:now,exp:now+300,...changes})).toString('base64url');const sig=crypto.sign('RSA-SHA256',Buffer.from(head+'.'+body),keyToSign).toString('base64url');return head+'.'+body+'.'+sig;}
function rejected(payload,reason,keys=[key]){assert.throws(()=>verifyIdToken(payload,keys,clientId,nonce),undefined,reason);passed++}
(async()=>{
 const valid=verifyIdToken(jwt(),[key],clientId,nonce);check('valid Google signed ID token',valid.sub==='teacher-google-sub');
 rejected(jwt({aud:'other-client'}),'wrong audience');
 rejected(jwt({iss:'https://evil.example'}),'wrong issuer');
 rejected(jwt({nonce:'reused-nonce'}),'nonce binding');
 rejected(jwt({exp:now-1}),'expired');
 rejected(jwt({iat:now+1000}),'future issued');
 rejected(jwt({email_verified:false}),'unverified email');
 rejected(jwt({sub:''}),'empty subject');
 rejected(jwt(), 'untrusted JWKS', []);
 const {privateKey:other}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});rejected(jwt({},other),'forged signature');
 check('redirect never accepts external domain',safeDestination('https://evil.example/steal')==='/kumanda');
 check('redirect never accepts javascript URLs',safeDestination('javascript:alert(1)')==='/kumanda');
 check('valid local pairing redirect kept',safeDestination('/kumanda?pair='+('a'.repeat(32)))==='/kumanda?pair='+('a'.repeat(32)));
 check('configured online auth rejects plain HTTP IP',(()=>{try{createGoogleAuth({ATLAS_GOOGLE_CLIENT_ID:clientId,ATLAS_GOOGLE_CLIENT_SECRET:'dummy',ATLAS_PUBLIC_ORIGIN:'http://192.168.1.11:8765',ATLAS_LOGIN_MODE:'google'});return false;}catch{return true;}})());
 check('google-only mode needs OAuth config',(()=>{try{createGoogleAuth({ATLAS_LOGIN_MODE:'google'});return false;}catch{return true;}})());
 const app=createGoogleAuth({ATLAS_GOOGLE_CLIENT_ID:clientId,ATLAS_GOOGLE_CLIENT_SECRET:'placeholder',ATLAS_PUBLIC_ORIGIN:'https://atlas.example.org',ATLAS_LOGIN_MODE:'google'});
 check('HTTPS Google configuration is enabled',app.enabled&&app.required&&app.secure);
 const http=require('node:http');const server=http.createServer(async(req,res)=>{await app.handle(req,res,new URL(req.url,'https://atlas.example.org'));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const url='http://127.0.0.1:'+server.address().port;
  const start=await fetch(url+'/auth/google/start?return_to='+encodeURIComponent('/kumanda?pair='+('a'.repeat(32))),{redirect:'manual'});
  const loc=new URL(start.headers.get('location'));
  check('Google auth uses code+PKCE S256',start.status===302&&loc.hostname==='accounts.google.com'&&loc.searchParams.get('response_type')==='code'&&loc.searchParams.get('code_challenge_method')==='S256');
  check('Google scope has no Gmail access',loc.searchParams.get('scope')==='openid email profile');
  check('state cookie is HttpOnly and Secure',/HttpOnly/.test(start.headers.get('set-cookie'))&&/Secure/.test(start.headers.get('set-cookie')));
  const fake=await fetch(url+'/auth/google/callback?state=bad&code=fake');
  check('callback without matching state denied',fake.status===401);
  const me=await fetch(url+'/auth/me');check('unauthenticated /auth/me denied',me.status===401);
  const redirectUri=app.publicInfo().redirectUri;check('documentable exact redirect URI',redirectUri==='https://atlas.example.org/auth/google/callback');
 }finally{await new Promise(resolve=>server.close(resolve));}
 console.log('v6.23 Google auth tests: '+passed+'/'+passed+' passed');
})().catch(e=>{console.error(e);process.exitCode=1});
