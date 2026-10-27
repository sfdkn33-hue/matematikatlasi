(function(){
  "use strict";
  var KEY="atlas15_role";
  function read(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function write(value){try{localStorage.setItem(KEY,value)}catch(e){}}
  function dashboard(role){return role==="teacher"?"ogretmen-paneli.html":"ogrenci-paneli.html"}
  window.Atlas15={getRole:read,setRole:write,dashboard:dashboard};
  var pick=document.querySelectorAll("[data-atlas15-role]");
  pick.forEach(function(btn){btn.addEventListener("click",function(){var r=btn.getAttribute("data-atlas15-role"); if(!/^(teacher|student)$/.test(r))return;write(r);window.location.href=dashboard(r)})});
  var isGateway=document.body&&document.body.getAttribute("data-portal")==="gateway";
  if(isGateway){
    var qs=new URLSearchParams(location.search);
    var existing=read();
    if(qs.get("sec")!=="1" && (existing==="teacher"||existing==="student")){location.replace(dashboard(existing))}
  }
  var filter=document.querySelector("[data-atlas15-filter]");
  if(filter){
    var count=document.querySelector("[data-atlas15-count]");
    var cards=[].slice.call(document.querySelectorAll("a.card[data-label]"));
    function apply(){var q=(filter.value||"").trim().toLocaleLowerCase("tr");var n=0;cards.forEach(function(card){var match=card.getAttribute("data-label").toLocaleLowerCase("tr").includes(q);card.classList.toggle("hide",!match);if(match)n++});
      document.querySelectorAll(".tool-section").forEach(function(section){section.hidden=!section.querySelector("a.card:not(.hide)")});if(count)count.textContent=n+" uygulama gösteriliyor"}
    filter.addEventListener("input",apply);apply();
  }
})();
