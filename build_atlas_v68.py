from pathlib import Path
import json,collections,shutil,re,html
S=Path('/mnt/data/atlas_v67_src');D=Path('/mnt/data/atlas_v68_src')
if D.exists():shutil.rmtree(D)
shutil.copytree(S,D,ignore=shutil.ignore_patterns('*.zip','QA_*.png'))
p=D/'data/tasks.json'; db=json.loads(p.read_text()); existing=db['tasks'][:]; codes={o['kod']:o for o in db['outcomes']}
N=[]
def n(label,value):return {'label':label,'expected':value}
def new(code,family,question,mode,opts,expected,nums,visual,solution,hint, level='Orta'):
 ix=1+sum(t['ogrenme_ciktisi']==code for t in N)
 grade=codes[code]['sinif']; b=next(t for t in existing if t['ogrenme_ciktisi']==code)
 tid='MA68-'+str(grade)+'-'+str(ix).zfill(2)
 if mode in ('order','tiles'):assert isinstance(expected,list) and len(expected)==len(set(expected)) and set(expected)==set(opts),(family,expected,opts)
 else: assert expected in opts,(family,expected,opts)
 assert all(isinstance(v['expected'],(float,int)) for v in nums)
 pilot=dict(pilot_id=tid,style=family,family=family,fields=[{'type':'numeric',**v} for v in nums],explanation=solution,representation=visual['kind'],question=question,difficulty=level,source_type='Atlas v6.8 özgün pilot; MEB çıkmış soru değildir',status='Öğrenci saha testi bekliyor')
 a={k:b.get(k) for k in ('plan_sirasi','tema_sirasi','tema','tema_ici_sira','sinif')}
 a.update(id=tid,ogrenme_ciktisi=code,rol='Matematik araştırmacısı',mekan='Atlas · Tam Öğrenme Stüdyosu',gorev_no=str(sum(t['ogrenme_ciktisi']==code for t in existing)+ix),seviye='3' if level=='Zor' else '2',asama='Kur · Karar ver · Doğrula',baslik=family,gorev=question,mekanik='v6.8 · '+('Kartlarla model kurma' if mode in ('order','tiles') else 'Grafik/şema analizi ve kanıt'),kontrol_turu='etkilesimli',beklenen_yanit_veya_rubrik='1',ipucu=hint,oyuncu_eylemi='Model seçimlerini ve matematiksel kanıtını tamamla',sure_dakika='5',ogrenci_urun='Doğrulanmış model ve otomatik değerlendirme',curriculum_version='MEB-2018' if grade=='8' else 'TYMM-2024',atlas68Workbench={'mode':mode,'options':opts,'expected':expected,'numbers':nums,'visual':visual,'explanation':solution},atlas63Pilot=pilot)
 N.append(a)

def options(correct,*other):return [*other,correct] # deliberately shuffle later by distinct data
# 6th decimal: place, decomposition, compare, error diagnosis
code='MAT.6.1.5'
for i,(s,digits) in enumerate([('6,241',[6,2,4,1]),('3,578',[3,5,7,8]),('8,914',[8,9,1,4])]):
 seq=list(s); cards=[seq[k] for k in [4,0,2,1,3]]
 new(code,'Basamak kartlarıyla sayı oluştur','Kartları sırayla dokunarak '+s+' sayısını kur. Sonra yüzde birler basamağını yaz.','order',cards,seq,[n('Yüzde birler basamağındaki rakam',digits[2])],{'kind':'decimal','given':'Birler | Onda | Yüzde | Binde'},s+' sayısında yüzde birler rakamı '+str(digits[2])+'.','Virgülden sonraki ikinci rakama bak.')
for s,opts,ans,thousand in [('4,235',['4+0,2+0,03+0,005','4+0,2+0,3+0,005','4+0,02+0,03+0,005'],'4+0,2+0,03+0,005',5),('7,608',['7+0,6+0,008','7+0,06+0,008','7+0,6+0,08'],'7+0,6+0,008',8),('2,471',['2+0,4+0,07+0,001','2+0,04+0,07+0,001','2+0,4+0,7+0,001'],'2+0,4+0,07+0,001',1)]:
 new(code,'Çözümlemeyi seç',''+s+' sayısının doğru ondalık çözümlemesini seç ve binde birler rakamını yaz.','decision',opts,ans,[n('Binde birler rakamı',thousand)],{'kind':'decimal','given':s},'Doğru çözümleme: '+ans+'.','Onda, yüzde, binde basamaklarını ayrı değerlendir.')
for a,b,relation,diff in [('0,509','0,590','İkinci büyük',81),('0,730','0,703','Birinci büyük',27),('2,405','2,450','İkinci büyük',45)]:
 new(code,'Binde birliklerle karşılaştır',a+' ve '+b+' sayılarını karşılaştır. Büyük olanı seç, farkın kaç binde bir olduğunu yaz.','decision',['Birinci büyük','İkinci büyük','Eşit'],relation,[n('Fark (binde birlik)',diff)],{'kind':'compare','values':[a,b]},'Binde birimler üzerinden fark '+str(diff)+'.','Basamak sayısını eşitle: 0,590 gibi.')
for s,claim,opts,ans,correct in [('5,032','Yüzde birler rakamı 3’tür.',['İddia doğru','İddia yanlış'],'İddia doğru',3),('1,706','Onda birler rakamı 0’dır.',['İddia doğru','İddia yanlış'],'İddia yanlış',7),('9,184','Binde birler rakamı 8’dir.',['İddia doğru','İddia yanlış'],'İddia yanlış',4)]:
 label='Yüzde birler rakamı' if 'Yüzde' in claim else 'Onda birler rakamı' if 'Onda' in claim else 'Binde birler rakamı'
 new(code,'Basamak hatasını yakala',s+' için iddia: “'+claim+'” İddiayı değerlendir ve '+label.lower()+'nı yaz.','decision',opts,ans,[n('Doğru '+label,correct)],{'kind':'decimal','given':s},s+' sayısında ilgili basamak '+str(correct)+'.','Virgülden sonrasını basamak basamak kontrol et.')
# 7th data: axis, median, sample bias, percent
code='MAT.7.6.2'
for a,b,base in [(98,102,95),(47,53,45),(196,204,190)]:
 delta=b-a
 new(code,'Eksen yanılgısı','A='+str(a)+', B='+str(b)+'. Grafiğin dikey ekseni '+str(base)+'’ten başlıyor. Gerçek farkı bul ve görselin farkı abartıp abartmadığını seç.','decision',['Fark abartılır','Fark küçülür','Fark değişmez'], 'Fark abartılır',[n('Gerçek fark',delta)],{'kind':'bars','labels':['A','B'],'values':[a,b],'baseline':base},'Gerçek fark '+str(delta)+'; sıfırdan başlamayan eksen farkı görsel olarak büyütür.','Grafik yüksekliği sayısal fark değildir.')
for values in [[9,3,15,7,11],[12,5,20,9,14],[18,6,24,10,16]]:
 sorted_values=sorted(values);med=sorted_values[2]; opt=list(map(str,[values[2],values[0],values[3],values[1],values[4]])); exp=list(map(str,sorted_values))
 new(code,'Sıralayıp ortancayı bul','Veri kartlarını küçükten büyüğe yerleştir; ortanca değeri yaz.','order',opt,exp,[n('Ortanca',med)],{'kind':'dataset','values':values},'Sıralama '+', '.join(exp)+'. Ortanca '+str(med)+'.','Beş sayının üçüncüsü ortancadır.')
for a,b,context in [(6,14,'Yalnız okul basketbol takımına soruldu.'),(12,8,'Yalnız kütüphane kulübü üyelerine soruldu.'),(9,11,'Yalnız bir sınıftaki öğrencilere soruldu.')]:
 new(code,'Örneklem dedektifi',context+' A='+str(a)+' kişi, B='+str(b)+' kişi. Bu sonuç tüm okul için genellenebilir mi? Örneklem büyüklüğünü de bul.','decision',['Temsil yanlılığı riski var','Tüm okul kesin temsil edildi','Herkes katıldı'],'Temsil yanlılığı riski var',[n('Katılan kişi',a+b)],{'kind':'bars','labels':['A','B'],'values':[a,b],'baseline':0},'Toplam '+str(a+b)+' kişi; seçilen grubun tüm okulu temsil ettiği bilinmez.','Kimlerin ankete katıldığına bak.')
for a,b,trend,percent in [(40,50,'Artış',25),(80,60,'Azalış',25),(50,65,'Artış',30)]:
 new(code,'Yüzdelik değişim','Önce '+str(a)+', sonra '+str(b)+' kişi. Değişimin yönünü seç ve ilk değere göre yüzde değişimi hesapla.','decision',['Artış','Azalış','Değişmedi'],trend,[n('Mutlak yüzde değişim',percent)],{'kind':'bars','labels':['Önce','Sonra'],'values':[a,b],'baseline':0},'Mutlak fark '+str(abs(b-a))+', yüzde '+str(percent)+'.','Yüzde değişimde payda ilk değerdir.')
# 8th algebra
code='M.8.2.1.2'
for a,b,c,d in [(2,3,1,4),(3,2,2,5),(1,5,2,3)]:
 terms=[f'{a*c}x²',f'{b*c}x',f'{a*d}x',str(b*d)]
 opts=[terms[2],terms[0],terms[3],terms[1]]
 new(code,'Cebirsel alan karoları',f'({a}x+{b})({c}x+{d}) çarpımının dört hücresini sırayla doldur: sol üst, sağ üst, sol alt, sağ alt. Benzer x terimlerinin toplam katsayısını yaz.','tiles',opts,terms,[n('x katsayısı',a*d+b*c)],{'kind':'tiles','labels':[f'{a}x',str(b),f'{c}x',str(d)]},f'{a*c}x²+{a*d+b*c}x+{b*d}.','Önce dört ayrı çarpımı bul, sonra x terimlerini topla.')
for a,b,c,d in [(1,2,1,5),(2,3,1,4),(3,1,1,2)]:
 xcoef=a*d+b*c
 new(code,'Eksik çarpımı yakala',f'({a}x+{b})({c}x+{d}) çarpımını öğrenci {a*c}x²+{a*d}x+{b*d} yazmış. Hata türünü ve doğru x katsayısını bul.','decision',['Bir çapraz çarpım unutuldu','Sabit çarpım yanlıştı','x² terimi yanlıştı'],'Bir çapraz çarpım unutuldu',[n('Doğru x katsayısı',xcoef)],{'kind':'tiles','labels':[f'{a}x',str(b),f'{c}x',str(d)]},f'{b*c}x terimi eksik, doğru katsayı {xcoef}.','Dağıtma özelliğinde dört parça vardır.')
for a,b,c,d in [(1,3,1,4),(2,1,1,3),(1,5,2,1)]:
 x2=a*c;middle=a*d+b*c;const=b*d;formula=f'{x2}x²+{middle}x+{const}'
 new(code,'Doğru cebirsel ifadeyi seç',f'({a}x+{b})({c}x+{d}) çarpımına eş olan ifadeyi seç; x² katsayısını yaz.','decision',[formula,f'{x2}x²+{middle+1}x+{const}',f'{x2}x²+{middle}x+{const+1}'],formula,[n('x² katsayısı',x2)],{'kind':'tiles','labels':[f'{a}x',str(b),f'{c}x',str(d)]},'Eşdeğer ifade '+formula+'.','Dört alan parçasını topla.')
for a,b,c,d,x in [(1,2,1,4,2),(2,1,1,3,3),(1,3,2,2,2)]:
 area=(a*x+b)*(c*x+d);middle=a*d+b*c
 new(code,'Bahçe alanını hesapla',f'Bir dikdörtgenin kenarları ({a}x+{b}) ve ({c}x+{d}) metredir. x={x} için alanı bul; açılımda x teriminin katsayısını seç.','decision',[str(middle),str(middle+2),str(a*c)],str(middle),[n('Alan (m²)',area)],{'kind':'tiles','labels':[f'{a}x',str(b),f'{c}x',str(d)]},f'Alan {area} m², x katsayısı {middle}.','Önce yerine koyup alanı, sonra açılımı hesapla.','Zor')
assert len(N)==36
assert len(set(x['id'] for x in N))==36
assert set(x['id'] for x in existing).isdisjoint(set(x['id'] for x in N))
db['tasks'].extend(N)
assert db['tasks'][:4001]==existing
p.write_text(json.dumps(db,ensure_ascii=False,separators=(',',':')))
(D/'data/tasks.js').write_text('window.ATLAS_DB='+json.dumps(db,ensure_ascii=False,separators=(',',':'))+';')
summary=json.loads((D/'data/summary.json').read_text());summary.update(version='v6.8',active_tasks=len(db['tasks']),grade_counts=dict(collections.Counter(t['sinif'] for t in db['tasks'])),v68_new_tasks=36,v68_preserved_tasks=4001,v68_tagged_pilot_tasks=152,v68_qa_status='QA pending');(D/'data/summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
# gate through native check; avoid original pilot layer taking our new tasks
app=D/'assets/js/app.js';s=app.read_text();s=s.replace('a.atlas63Pilot||a.atlas61Lab','a.atlas68Workbench||a.atlas63Pilot||a.atlas61Lab');s=s.replace('if(x.atlas63Pilot && window.__atlas63Verified!==x.id)',"if(x.atlas68Workbench && window.__atlas68Verified!==x.id){feedback('Önce v6.8 Ana Etkinlik alanındaki görsel modeli ve matematiksel kanıtı tamamla.');return}\nif(x.atlas63Pilot && window.__atlas63Verified!==x.id)");app.write_text(s)
pilot=D/'assets/js/atlas63_pilot_lab.js';s=pilot.read_text().replace('db.tasks.filter(t=>t.atlas63Pilot).map','db.tasks.filter(t=>t.atlas63Pilot&&!t.atlas68Workbench).map');pilot.write_text(s)
idx=D/'index.html';s=idx.read_text();s=s.replace('<section id="atlas63PilotLab"','<section id="atlas68Lab" hidden aria-label="v6.8 tam öğrenme ana modeli"></section><section id="atlas63PilotLab"');s=s.replace('<link rel="stylesheet" href="assets/css/atlas67_safety.css">','<link rel="stylesheet" href="assets/css/atlas67_safety.css"><link rel="stylesheet" href="assets/css/atlas68_style.css">');s=s.replace('<script defer src="assets/js/atlas65_audit.js"></script>','<script defer src="assets/js/atlas65_audit.js"></script><script defer src="assets/js/atlas68_lab.js"></script>');s=s.replace('v6.7 · Öğrenme ve Kayıt Güvenliği','v6.8 · Tam Öğrenme Ana Etkinlikleri');idx.write_text(s)
print('Ready v68',len(db['tasks']),collections.Counter(x['ogrenme_ciktisi'] for x in N),len(N))
