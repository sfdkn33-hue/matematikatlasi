(function(){"use strict";
function init(){
 var KEY="atlas15_role", r="student";try{r=localStorage.getItem(KEY)||"student"}catch(e){}
 var target=r==="teacher"?"ogretmen-paneli.html":"ogrenci-paneli.html";
 var box=document.createElement("nav"); box.setAttribute("aria-label","Atlas çalışma alanı");box.className="atlas15-back";
 box.innerHTML='<details><summary aria-label="Atlas menüsü">☰ Atlas</summary><div class="atlas15-menu"><a href="'+target+'">⌂ Panele dön</a><a href="index.html?sec=1">⇄ Rol değiştir</a></div></details>';
 document.body.appendChild(box);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
