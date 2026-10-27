/* v6.64 geometry math: pure, dependency-free, independently testable. */
(function(host){'use strict';
 const add=(u,v)=>[u[0]+v[0],u[1]+v[1]],sub=(u,v)=>[u[0]-v[0],u[1]-v[1]];
 const mul=(u,k)=>[u[0]*k,u[1]*k],dot=(u,v)=>u[0]*v[0]+u[1]*v[1];
 const cross=(u,v)=>u[0]*v[1]-u[1]*v[0],length=u=>Math.hypot(...u);
 function target(kind,pts){const [a,b,c]=pts,v=sub(c,b);
  if(kind==='median')return mul(add(b,c),0.5);
  if(kind==='altitude'){const t=dot(sub(a,b),v)/dot(v,v);return add(b,mul(v,t));}
  if(kind==='angle'){const u=sub(b,a),w=sub(c,a),lu=length(u),lw=length(w);const bis=add(mul(u,1/lu),mul(w,1/lw));return add(a,mul(bis,3/length(bis)));}
  throw Error('Unknown construction kind');
 }
 function validTriangle(pts){if(!Array.isArray(pts)||pts.length!==3||pts.some(p=>!p||p.length!==2||p.some(x=>!Number.isFinite(x)||x< -5.5||x>5.5)))return false;
  const [a,b,c]=pts,ab=sub(b,a),ac=sub(c,a),bc=sub(c,b);
  return Math.abs(cross(ab,ac))>=3.0 && [ab,ac,bc].every(v=>length(v)>=1.5) && Math.abs(dot(ab,ac)/(length(ab)*length(ac)))<.98;
 }
 function validate(kind,pts,q){if(!validTriangle(pts)||!q||q.length!==2||q.some(x=>!Number.isFinite(x)||x< -5.5||x>5.5))return false;
  const t=target(kind,pts);if(kind==='angle'){
   const ray=sub(t,pts[0]),s=sub(q,pts[0]),proj=dot(s,ray)/length(ray);
   return proj>=.7 && Math.abs(cross(ray,s))/length(ray)<=.20;
  }
  return length(sub(t,q))<=.19;
 }
 const api={add,sub,mul,dot,cross,length,target,validate,validTriangle};
 host.MatematikAtlas664Math=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
