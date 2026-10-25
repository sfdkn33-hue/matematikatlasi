/* Personal data must not be entered; this offline playground never sends network requests. */
(()=>{'use strict';const $=id=>document.getElementById(id);
const make=(par,tag,txt='',cls='')=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==null)e.textContent=String(txt);par.append(e);return e};
let last=null;
const format=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:2});
function analyze(){const category=$('freeType').value==='category';const raw=$('freeValues').value;const parts=raw.split(/[;\n]+/).map(x=>x.trim()).filter(Boolean);
if(parts.length<3||parts.length>100){$('freeStatus').textContent='3 ile 100 arasında anonim gözlem girin.';return}
if(parts.some(x=>x.length>50)){$('freeStatus').textContent='Gözlem etiketleri 50 karakteri aşmamalı.';return}
let values=parts;
if(!category){if(parts.some(x=>!/^(0|[1-9]\d{0,3})$/.test(x))){$('freeStatus').textContent='Kesikli nicel veri için yalnızca 0–9999 arasındaki tam sayıları kullanın.';return}values=parts.map(Number)}
const freq=new Map();for(const val of values)freq.set(val,(freq.get(val)||0)+1);
const sorted=[...freq.entries()].sort((a,b)=>category?String(a[0]).localeCompare(String(b[0]),'tr'):a[0]-b[0]);
last={category,sorted,values};const root=$('freeResults');root.replaceChildren();make(root,'h2','Araştırma özeti');make(root,'p',$('freeQuestion').value.trim()||'Araştırma sorusu girilmedi');
const stats=make(root,'div',null,'rs-cards');for(const [label,value] of [['Gözlem sayısı',values.length],['Farklı değer',freq.size]]){const k=make(stats,'div',null,'rs-card');make(k,'small',label);make(k,'strong',value)}
if(!category){const sum=values.reduce((a,b)=>a+b,0),v=[...values].sort((a,b)=>a-b),n=v.length,med=(v[Math.floor((n-1)/2)]+v[Math.floor(n/2)])/2,maxF=Math.max(...freq.values()),modes=sorted.filter(([,count])=>count===maxF).map(([label])=>label);
for(const [label,value] of [['Ortalama',format(sum/n)],['Ortanca',format(med)],['Tepe değer(ler)',maxF===1?'Tek tepe değer yok':modes.join(', ')],['Açıklık',v.at(-1)-v[0]]]){const k=make(stats,'div',null,'rs-card');make(k,'small',label);make(k,'strong',value)}}
const chart=make(root,'div',null,'rs-bars free-chart');chart.setAttribute('role','img');chart.setAttribute('aria-label','Sıklık grafiği: '+sorted.map(([k,v])=>k+' '+v).join('; '));const h=Math.max(...freq.values());
for(const [label,count] of sorted){const col=make(chart,'div',null,'rs-bar-col');make(col,'b',count);const track=make(col,'div',null,'rs-bar-track');const bar=make(track,'div',null,'rs-bar');bar.style.height=125*count/h+'px';make(col,'small',label)}
if(!category&&values.every(v=>v>=10&&v<=99)){
const map=new Map();for(const v of [...values].sort((a,b)=>a-b)){const stem=Math.floor(v/10);if(!map.has(stem))map.set(stem,[]);map.get(stem).push(v%10)}
make(root,'h3','Kök–yaprak gösterimi');const pre=make(root,'pre');pre.textContent=[...map].map(([stem,leaves])=>stem+' | '+leaves.join(' ')).join('\n')}
make(root,'p','Yorumlama: Grafik ve hesaplamalar tek başına bütün evren için kanıt değildir. Örneklemin nasıl toplandığını ve olası yanlılıkları tartışın.','free-data');
$('freeStatus').textContent=values.length+' gözlem analiz edildi. Sayfa hiçbir veri göndermedi.';
}
function csv(){if(!last){$('freeStatus').textContent='Önce bir analiz yapın.';return}const rows=[['Araştırma','Veri türü','Değer','Sıklık'],...last.sorted.map(([x,count])=>[$('freeQuestion').value,last.category?'Kategorik':'Kesikli nicel',x,count])];const data='\ufeff'+rows.map(r=>r.map(x=>'"'+String(x).replace(/^[\t\r\n ]*[=+@-]/,m=>"'"+m).replaceAll('"','""')+'"').join(';')).join('\r\n');const blob=new Blob([data],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='matematik_atlasi_anonim_veri.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
$('freeAnalyze').addEventListener('click',analyze);$('freeDownload').addEventListener('click',csv);
$('freeDemo').addEventListener('click',()=>{$('freeQuestion').value='Öğrencilerin ulaşım tercihleri nasıl dağılıyor?';$('freeType').value='category';$('freeValues').value='Yürüyüş; Servis; Bisiklet; Yürüyüş; Servis; Servis; Bisiklet; Yürüyüş; Bisiklet; Yürüyüş; Servis; Yürüyüş';analyze()});
$('freeType').addEventListener('change',()=>{if($('freeType').value==='number'){$('freeQuestion').value='Sınıfımızda öğrenciler haftada kaç kitap okuyor?';$('freeValues').value='2; 3; 4; 2; 5; 3; 2; 4; 3; 6; 4; 3'}else{$('freeQuestion').value='Öğrencilerin ulaşım tercihleri nasıl dağılıyor?';$('freeValues').value='Yürüyüş; Servis; Bisiklet; Yürüyüş; Servis; Bisiklet'}});analyze();
})();
