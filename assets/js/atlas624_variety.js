/* Matematik Atlası v6.24: konu/öğrenme çıktısını ve zorluk basamaklarını koruyan çeşitlendirilmiş sıra.
   Bu modül YENİ matematik sorusu üretmez; aynı şablondaki görevlerin arka arkaya gelmesini azaltır.
   Öğrencinin kazanım/tamamlanma kaydı görev ID'leriyle aynen korunur. */
(function(root){
 'use strict';
 function key(task){
   if(task.atlas626?.family)return 'new:'+task.atlas626.family;
   if(task.atlas658?.family)return 'v658:'+task.atlas658.family;
   const stem=String(task.gorev||'').toLocaleLowerCase('tr-TR')
     .replace(/[+-]?\d+(?:[.,]\d+)?(?:\s*\/\s*\d+)?/gu,'#')
     .replace(/\s+/gu,' ').trim();
   // Aynı sorunun sayıları değiştirilmiş sürümleri bir aile sayılır; karma mekanikler korunur.
   let engine='';
   for(const prop of ['atlas8Lab48','factorLab','decimalLab','atlas49','atlas50','atlas51','atlas52','atlas53','atlas54','atlas55','atlas56','atlas57','atlas7Lab','number5PlusLab','fraction5PlusLab','geometry6Lab','algebra6Lab','atlas68Workbench']){
     if(task[prop]){let c=task[prop];engine=prop+':'+String(c.kind||c.mode||c.type||'');break;}
   }
   return engine+'|'+stem;
 }
 function format(task){return task.atlas626?.steps?.[0]?.type||task.studio?.kind||'klasik';}
 function grade(task){const n=Number(task.seviye);return Number.isFinite(n)?n:0;}
 function arrange(list){
   if(!Array.isArray(list)||list.length<3)return Array.isArray(list)?list.slice():[];
   const sorted=[];
   // Seviye artışını koru, sadece aynı seviye içindeki stilleri çeşitlendir.
   const levels=new Map();
   for(const task of list){const n=grade(task);if(!levels.has(n))levels.set(n,[]);levels.get(n).push(task);}
   let previous=null,previousFormat=null;
   for(const level of [...levels.keys()].sort((a,b)=>a-b)){
     const group=levels.get(level), queues=new Map(), firstSeen=new Map();
     for(let i=0;i<group.length;i++){const f=key(group[i]);if(!queues.has(f)){queues.set(f,[]);firstSeen.set(f,i);}queues.get(f).push(group[i]);}
     let remain=group.length;
     while(remain--){
       const available=[...queues].filter(([,v])=>v.length);
       // Aynı aileyi peş peşe getirme. Mümkün değilse güvenle özgün sırayı koruyan sıra üret.
       available.sort((a,b)=>{
         const aSame=a[0]===previous?1:0,bSame=b[0]===previous?1:0;
         const aType=format(a[1][0])===previousFormat?1:0,bType=format(b[1][0])===previousFormat?1:0;
         return aSame-bSame || aType-bType || b[1].length-a[1].length || firstSeen.get(a[0])-firstSeen.get(b[0]);
       });
       const [fam,q]=available[0];const next=q.shift();sorted.push(next);previous=fam;previousFormat=format(next);
     }
   }
   return sorted;
 }
 const api={key,format,arrange};
 root.MatematikAtlas624=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
