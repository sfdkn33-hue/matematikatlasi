/* Matematik Atlası v6.6: beş konu için görsel araştırma ve zorunlu seçim.
   Görselin seçimi, çok alanlı matematik kontrolü tamamlanmadan başarı oluşturmaz. */
(()=>{
 'use strict';
 const SVG='http://www.w3.org/2000/svg';
 const make=(tag,parent,txt,cls)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined&&txt!==null)el.textContent=txt;parent.appendChild(el);return el};
 const sv=(tag,parent,attrs={},txt)=>{const el=document.createElementNS(SVG,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));if(txt!==undefined)el.textContent=txt;parent.appendChild(el);return el};
 function render(holder,v,root){
  root.dataset.v66Picked='';
  const box=make('div',holder,undefined,'a66-visual');box.setAttribute('aria-label','Görsel veri ve zorunlu model seçimi');
  const heading=make('p',box,'Modeli incele, altında uygun seçeneğe dokun.','a66-intro');
  const svg=sv('svg',box,{viewBox:'0 0 360 184',role:'img','aria-label':'Matematiksel model: '+v.kind});
  const line=(x1,y1,x2,y2,stroke='#567b99',w=2)=>sv('line',svg,{x1,y1,x2,y2,stroke,'stroke-width':w});
  const txt=(x,y,s,fs=13,fill='#17394e')=>sv('text',svg,{x,y,fill,'font-size':fs,'text-anchor':'middle'},String(s));
  if(v.kind==='bars'){
   const vals=v.values.map(Number);const base=Number(v.baseline)||0,max=Math.max(...vals,base+1);const w=Math.min(60,250/vals.length-10);const area=120;line(32,147,344,147);line(32,18,32,147);txt(17,147,base,11);txt(16,24,max,11);
   vals.forEach((value,i)=>{const x=46+(i+.5)*287/vals.length-w/2,h=Math.max(2,area*(value-base)/(max-base));sv('rect',svg,{x,y:147-h,width:w,height:h,fill:i%2?'#df9042':'#2983a6',rx:5});txt(x+w/2,Math.max(17,139-h),value,12);txt(x+w/2,166,v.labels[i],11)});
   txt(179,181,base?'Dikkat: eksen '+base+' değerinden başlıyor.':'Düşey eksen 0’dan başlıyor.',11);
  }else if(v.kind==='tokens'){
   const vals=v.values.map(Number), total=vals.reduce((a,b)=>a+b,0);const colors=['#c94e5b','#247fbd','#3b997b','#d6a14d'];
   v.labels.forEach((label,j)=>{txt(180,18+j*46,label+' ('+vals[j]+')',13);for(let i=0;i<vals[j];i++){
      const x=33+(i%12)*26,y=39+Math.floor(i/12)*24+j*46;
      sv('circle',svg,{cx:x,cy:y,r:8.6,fill:colors[j%colors.length],stroke:'#fff','stroke-width':1});
    }});
   txt(179,179,'Toplam '+total+' eş şanslı nesne',12);
  }else if(v.kind==='cards'){
   const labels=v.labels||[];txt(180,25,'Eş şanslı numara kartları',14);
   labels.forEach((s,i)=>{let x=15+(i%10)*33,y=58+Math.floor(i/10)*55;sv('rect',svg,{x,y,width:29,height:39,rx:5,fill:'#e0f1f9',stroke:'#2b779c','stroke-width':1.8});txt(x+14.5,y+25,s,16)});
  }else if(v.kind==='root'){
   const rad=Number(v.radicand),a=Number(v.values[0]),b=Number(v.values[1]);txt(180,24,'√'+rad+' sayı doğrusunda nerede?',16);
   line(28,92,332,92,'#236a96',4);line(40,80,40,106);line(320,80,320,106);
   txt(40,130,a,17);txt(320,130,b,17);
   const ratio=Math.max(0,Math.min(1,Math.sqrt(rad)-a));const px=40+280*ratio;
   sv('circle',svg,{cx:px,cy:92,r:8,fill:'#dd9141',stroke:'#fff','stroke-width':2});txt(px,70,'√'+rad,13);
   txt(180,160,a+'² ile '+b+'² sayıları arasında karşılaştır.',12);
  }else if(v.kind==='tiles'){
   const L=v.labels,V=v.values;txt(180,23,'Dağıtma modeli: dört alan hücresi',15);
   txt(130,48,L[0],14);txt(234,48,L[1],14);txt(34,89,L[2],14);txt(34,146,L[3],14);
   const cells=[[69,56],[174,56],[69,111],[174,111]];
   cells.forEach(([x,y],i)=>{sv('rect',svg,{x,y,width:100,height:50,rx:6,fill:i%2?'#e9edf9':'#e0f4ec',stroke:'#6a8399','stroke-width':1});txt(x+50,y+31,'?',19)});
   txt(180,181,'Her hücreyi çarp, sonra benzer terimleri topla.',11);
  }else if(v.kind==='line'){
   const points=v.values.map(row=>row.map(Number));const xs=points.map(p=>p[0]);const ys=points.flatMap(p=>p.slice(1));const x0=Math.min(0,...xs),x1=Math.max(1,...xs);const y0=Math.min(0,...ys),y1=Math.max(1,...ys);
   const X=z=>35+(z-x0)/(x1-x0||1)*290,Y=z=>144-(z-y0)/(y1-y0||1)*110;
   line(35,144,337,144);line(35,20,35,144);txt(18,23,y1,11);txt(20,147,y0,11);txt(322,166,x1,11);txt(38,166,x0,11);
   const n=points[0].length-1,colors=['#247caa','#d88843'];
   for(let j=0;j<n;j++){
    const series=points.map(p=>p);for(let i=0;i<series.length-1;i++)line(X(series[i][0]),Y(series[i][j+1]),X(series[i+1][0]),Y(series[i+1][j+1]),colors[j%2],3);
    series.forEach(p=>sv('circle',svg,{cx:X(p[0]),cy:Y(p[j+1]),r:4,fill:colors[j%2]}));
   }
   txt(180,180,n===2?'Mavi: A, Turuncu: B':'x değiştikçe y nasıl değişiyor?',12);
   const tab=make('table',box,undefined,'a66-table');const h=make('tr',tab);for(const label of ['x',...(n===2?['A','B']:['y'])])make('th',h,label);
   points.forEach(p=>{const tr=make('tr',tab);p.forEach(z=>make('td',tr,z))});
  }
  const action=make('fieldset',box,undefined,'a66-actions');const legend=make('legend',action,'Görsel kararı (zorunlu)');
  v.options.forEach((value,i)=>{const btn=make('button',action,value,'a66-choice');btn.type='button';btn.setAttribute('aria-pressed','false');btn.dataset.atlas66Pick=String(value);btn.onclick=()=>{
   root.dataset.v66Picked=String(value);action.querySelectorAll('button').forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))});
  }});
 }
 window.Atlas66Visual={render};
})();
