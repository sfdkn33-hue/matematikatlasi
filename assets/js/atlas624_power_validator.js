/* v6.24: pure mathematical verification for alternative power-of-ten reasoning modes.
   One correct power alone is NOT enough if the scenario asks for a second mathematical decision. */
(function(root){
  'use strict';
  function verify(model,state){
    if(!model||model.kind!=='power_shift'||!state)return false;
    if(state.shift===undefined||state.shift===null||state.shift===''||!Number.isInteger(Number(state.shift))||Number(state.shift)!==model.exp)return false;
    const v=model.variant||'direct';
    if(v==='direct')return true;
    if(v==='debug')return model.wrong_exp!==model.exp&&state.claim==='Yanlış';
    if(v==='direction')return state.direction===(model.exp<0?'Sola':'Sağa');
    if(v==='compare')return state.compare===(model.exp<0?'Küçüldü':'Büyüdü');
    return false;
  }
  const api={verify};root.MatematikAtlasPower624=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
