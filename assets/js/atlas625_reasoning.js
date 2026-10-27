/* Matematik Atlası 6.25 — six distinct families, thirty mathematical case designs.
   The numeric fields are checked without a teacher approval or any AI grading. */
(function(root){
 'use strict';
 function parse(raw){
   const s=String(raw??'').trim().replace(/\s+/g,'');
   if(!/^[+-]?\d+(?:[.,]\d+)?(?:\/[+-]?\d+(?:[.,]\d+)?)?$/.test(s))return NaN;
   const p=s.split('/').map(t=>Number(t.replace(',','.')));
   return p.length===2?(p[1]===0?NaN:p[0]/p[1]):p[0];
 }
 function expected(field){const e=field?.expected;return e&&Number.isFinite(Number(e.num))&&Number.isFinite(Number(e.den))&&Number(e.den)!==0?Number(e.num)/Number(e.den):NaN;}
 function close(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(b));}
 function inspect(caseData,reply){
   const data=caseData?.atlas625||caseData;
   if(!data||data.version!=='6.25'||!data.model||!Array.isArray(data.numbers))return {ok:false,field:'invalid'};
   if(reply?.model!==data.model.correct)return {ok:false,field:'model'};
   for(let i=0;i<data.numbers.length;i++){
     const v=parse(reply?.numbers?.[i]);
     if(!close(v,expected(data.numbers[i])))return {ok:false,field:'number'+(i+1)};
   }
   return {ok:true,field:null};
 }
 const api={parse,expected,inspect,close};
 root.MatematikAtlas625Math=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 })(typeof window==='undefined'?globalThis:window);
