/* Simulators reused from the original Optics Lab. */
/* ray tracer: mode 1 reflection, 2 refraction */
const N=[["Air",1],["Water",1.33],["Glass",1.5],["Diamond",2.42]];
function tracer(root,mode,n1i,n2i){
 const op=i=>N.map((n,j)=>`<option value="${n[1]}" ${j===i?"selected":""}>${n[0]} (n=${n[1]})</option>`).join("");
 root.innerHTML=`<div class=ctl><label>Incident angle: <b class=av></b><input class=a type=range min=0 max=89 value=40></label>${mode===2?`<label>Top material n₁<select class=n1>${op(n1i)}</select></label><label>Bottom material n₂<select class=n2>${op(n2i)}</select></label>`:""}</div><div class=stage><canvas width=800 height=340></canvas></div><div class=out></div>`;
 const cv=root.querySelector("canvas"),x=cv.getContext("2d"),A=root.querySelector(".a");
 function d(){const th=+A.value,r=th*Math.PI/180,n1=mode===2?+root.querySelector(".n1").value:1,n2=mode===2?+root.querySelector(".n2").value:1,L=170,ox=400,oy=170;
  x.clearRect(0,0,800,340);if(mode===2){x.fillStyle=C("--ac");x.globalAlpha=.12*n2;x.fillRect(0,oy,800,170);x.globalAlpha=.12*n1;x.fillRect(0,0,800,oy);x.globalAlpha=1}
  x.strokeStyle=C("--mute");x.lineWidth=mode===1?6:2;x.beginPath();x.moveTo(0,oy);x.lineTo(800,oy);x.stroke();
  x.setLineDash([6,5]);x.lineWidth=1;x.beginPath();x.moveTo(ox,10);x.lineTo(ox,330);x.stroke();x.setLineDash([]);
  const ln=(a,b,c)=>{x.strokeStyle=C("--ray");x.lineWidth=3;x.globalAlpha=c||1;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();x.globalAlpha=1};
  ln([ox-L*Math.sin(r),oy-L*Math.cos(r)],[ox,oy]);let t="";
  const s=n1*Math.sin(r)/n2;
  if(mode===2&&s<=1){const r2=Math.asin(s);ln([ox,oy],[ox+L*Math.sin(r2),oy+L*Math.cos(r2)]);ln([ox,oy],[ox+L*Math.sin(r),oy-L*Math.cos(r)],.25);t=`θ₂ = asin(${n1}·sin ${th}° / ${n2}) = <b>${(r2*180/Math.PI).toFixed(1)}°</b>`}
  else{ln([ox,oy],[ox+L*Math.sin(r),oy-L*Math.cos(r)]);t=mode===1?`θᵢ = θᵣ = <b>${th}°</b>`:`<b>Total internal reflection.</b> The angle is past the critical angle, so no light gets through.`}
  if(mode===2&&n1>n2)t+=` · critical angle ${(Math.asin(n2/n1)*180/Math.PI).toFixed(1)}°`;
  x.fillStyle=C("--ink");x.font=FONT("",15);x.fillText("normal",ox+6,24);
  root.querySelector(".av").textContent=th+"°";root.querySelector(".out").innerHTML=t}
 root.addEventListener("input",d);
 cv.addEventListener("pointermove",e=>{if(e.buttons&1){const b=cv.getBoundingClientRect(),px=(e.clientX-b.left)*800/b.width,py=(e.clientY-b.top)*340/b.height;if(py<170){A.value=Math.min(89,Math.max(0,Math.round(Math.atan2(Math.abs(px-400),170-py)*180/Math.PI)));d()}}});
 d();return d}
/* plane mirror */
function plane(root){root.innerHTML=`<div class=ctl><label>Object distance: <b></b> cm<input type=range min=2 max=40 step=.5 value=20></label></div><div class=stage><canvas width=800 height=340></canvas></div><div class=out></div><p class=mute>The dashed lines show where the light seems to come from. No light actually goes behind the mirror, so the image is virtual.</p>`;
 const cv=root.querySelector("canvas"),x=cv.getContext("2d"),r=root.querySelector("input"),k=8,mx=400,ay=250,h=70,ex=50,ey=90;
 const L=(a,b,c,dash)=>{x.strokeStyle=c;x.lineWidth=2;x.setLineDash(dash?[6,4]:[]);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();x.setLineDash([])};
 const A=(px,c,dash)=>{x.strokeStyle=x.fillStyle=c;x.lineWidth=4;x.setLineDash(dash?[6,4]:[]);x.beginPath();x.moveTo(px,ay);x.lineTo(px,ay-h);x.stroke();x.setLineDash([]);x.beginPath();x.moveTo(px,ay-h);x.lineTo(px-6,ay-h+10);x.lineTo(px+6,ay-h+10);x.fill()};
 function d(){const o=+r.value,ox=mx-o*k,ix=mx+o*k,ty=ay-h;root.querySelector("b").textContent=o.toFixed(1);x.clearRect(0,0,800,340);x.fillStyle="rgba(47,111,208,.09)";x.fillRect(mx,0,400,340);
  L([0,ay],[800,ay],C("--mute"));L([mx,40],[mx,300],C("--ac"));x.lineWidth=5;
  const hy=ey+(ty-ey)*(mx-ex)/(ix-ex);L([ox,ty],[mx,hy],C("--ray"));L([mx,hy],[ex,ey],"#2f6fd0");L([mx,hy],[ix,ty],"#888",1);
  A(ox,C("--ray"));A(ix,C("--ac"),1);x.fillStyle=C("--ink");x.beginPath();x.arc(ex,ey,7,0,7);x.fill();
  if(root.dataset.angles){L([mx-110,hy],[mx,hy],C("--mute"),1);x.fillStyle=C("--ink");x.font=FONT("",13);const a=Math.round(Math.atan2(Math.abs(hy-ty),mx-ox)*180/Math.PI);x.textAlign="right";x.fillText("θᵢ = "+a+"°",mx-8,hy+(ty>hy?18:-8));x.fillText("θᵣ = "+a+"°",mx-8,hy+(ty>hy?-8:18));x.textAlign="start"}x.font=FONT("bold",14);x.textAlign="center";x.fillText("Eye",ex,ey-14);x.fillText("Object",ox,ty-14);x.fillStyle=C("--ac");x.fillText("Image (virtual)",ix,ty-14);x.fillStyle=C("--mute");x.fillText("Plane mirror",mx,320);x.textAlign="start";
  root.querySelector(".out").innerHTML=`Object is <b>${o.toFixed(1)} cm</b> in front of the mirror, so the image is <b>${o.toFixed(1)} cm</b> behind it. Virtual, upright, same size.`}
 r.oninput=d;cv.addEventListener("pointermove",e=>{if(e.buttons&1){const b=cv.getBoundingClientRect();r.value=Math.min(40,Math.max(2,(mx-(e.clientX-b.left)*800/b.width)/k));d()}});d();return d}
/* mirror/lens simulator. sg: +1 concave/converging, -1 convex/diverging. fx: [f,do,h] for a fixed diagram. sh: shared scale between diagrams. */
const RC=["#d6191f","#2f6fd0","#e08a00"];
function sim(root,mirror,sg,fx,sh){
 const R1=sg>0?"Ray 1: parallel, then through F":"Ray 1: parallel, then seems to come from F",
  R2=mirror?(sg>0?"Ray 2: through F, then parallel":"Ray 2: aimed at F, then parallel"):(sg>0?"Ray 2: through F′, then parallel":"Ray 2: aimed at F′, then parallel"),
  R3=mirror?(sg>0?"Ray 3: through C, bounces straight back":"Ray 3: aimed at C, bounces straight back"):"Ray 3: through the center, no bending";
 root.innerHTML=`<div class=ctl><label>Focal length |f|: <b></b> cm<input class=f type=range min=3 max=50 step=.1 value=10></label><label>Object distance dₒ: <b></b> cm<input class=d type=range min=1 max=80 step=.1 value=${sg>0?15:20}></label><label>Object height hₒ: <b></b> cm<input class=h type=range min=.5 max=6 step=.1 value=3></label></div><div class=stage><canvas width=800 height=340></canvas></div><div class=out></div>`+(fx?"":`<div class=legend><span style="--c:#d6191f">Incident ray</span><span style="--c:#2f6fd0">${mirror?"Reflected":"Refracted"} ray</span><span style="--c:#888">Virtual extension</span></div>`);
 const q=s=>root.querySelector(s),cv=q("canvas"),x=cv.getContext("2d"),ay=170,ky=15;let fr=null,lv=null;
 function view(f,o,di){if(fr)return fr;const lim=3*Math.max(o,Math.abs(f)),dc=isFinite(di)?Math.max(-lim,Math.min(lim,di)):0;
  let xs=mirror?[0,-o,-f,-2*f,-dc]:[0,-o,f,-f,2*f,-2*f,dc];if(sh){sh[sg]=xs;xs=[].concat(...Object.values(sh))}
  let lo=Math.min(...xs),hi=Math.max(...xs);const p=(hi-lo)*.08+3;lo-=p;hi+=p;const kx=Math.min(18,760/(hi-lo));return{kx,ex:400-(lo+hi)/2*kx}}
 function d(){const f=sg*q(".f").value,o=+q(".d").value,h=+q(".h").value;
  [".f",".d",".h"].forEach(s=>q(s).previousElementSibling.textContent=(+q(s).value).toFixed(1));
  const g=1/f-1/o,none=Math.abs(g)<1e-3,di=none?Infinity:1/g,M=-di/o,V=lv=view(f,o,di),kx=V.kx,ex=V.ex,P=c=>mirror?ex-c*kx:ex+c*kx;
  x.clearRect(0,0,800,340);if(mirror){x.fillStyle="rgba(47,111,208,.09)";x.fillRect(ex,0,800-ex,340)}x.lineWidth=1;x.strokeStyle=C("--mute");x.beginPath();x.moveTo(0,ay);x.lineTo(800,ay);x.stroke();
  for(let c=-200;c<=200;c+=5){const px=ex+c*kx;if(px<0||px>800)continue;const t=c%10?3:6;x.beginPath();x.moveTo(px,ay-t);x.lineTo(px,ay+t);x.stroke()}
  x.lineWidth=4;x.strokeStyle=C("--ac");x.fillStyle=C("--ac");x.beginPath();
  if(mirror){const e=sg>0?-12:12,p0=[ex+e,ay-110],p1=[ex-e,ay],p2=[ex+e,ay+110];x.moveTo(...p0);x.quadraticCurveTo(...p1,...p2);x.stroke();
   x.lineWidth=1.5;for(let t=.05;t<1;t+=.1){const u=1-t,px=u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],py=u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1];x.beginPath();x.moveTo(px+2,py);x.lineTo(px+10,py+8);x.stroke()}}
  else{x.globalAlpha=.18;if(sg>0){x.moveTo(ex,ay-110);x.quadraticCurveTo(ex+24,ay,ex,ay+110);x.quadraticCurveTo(ex-24,ay,ex,ay-110)}else{x.moveTo(ex-13,ay-110);x.lineTo(ex+13,ay-110);x.quadraticCurveTo(ex+1,ay,ex+13,ay+110);x.lineTo(ex-13,ay+110);x.quadraticCurveTo(ex-1,ay,ex-13,ay-110)}x.fill();x.globalAlpha=1;x.lineWidth=2;x.stroke()}
  const ox=ex-o*kx,ty=ay-h*ky,lab=(px,t)=>{x.fillStyle=C("--ink");x.font=FONT("bold",14);x.textAlign="center";x.fillText(t,px,ay+22);x.textAlign="start";x.beginPath();x.arc(px,ay,3.5,0,7);x.fill()};
  if(mirror){lab(P(f),"F");lab(P(2*f),"C")}else{lab(ex+f*kx,"F");lab(ex-f*kx,"F′");lab(ex+2*f*kx,"2F");lab(ex-2*f*kx,"2F′")}
  const tag=(t,px,py,c)=>{x.fillStyle=c;x.font=FONT("bold",14);x.textAlign="center";x.fillText(t,Math.min(740,Math.max(60,px)),Math.min(330,Math.max(16,py<ay?py-14:py+26)));x.textAlign="start"};
  const arrow=(px,py,dash,c)=>{x.strokeStyle=c;x.lineWidth=4;x.setLineDash(dash?[6,4]:[]);x.beginPath();x.moveTo(px,ay);x.lineTo(px,py);x.stroke();x.setLineDash([]);x.fillStyle=c;x.beginPath();const u=py<ay?1:-1;x.moveTo(px,py);x.lineTo(px-6,py+10*u);x.lineTo(px+6,py+10*u);x.fill()};
  const ln=(a,b,c,dash)=>{x.strokeStyle=c;x.lineWidth=2;x.setLineDash(dash?[5,4]:[]);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();x.setLineDash([])};
  const cx=P(2*f),h3=mirror?(Math.abs(cx-ox)<1?null:[ex,ay-(ay-ty)*(cx-ex)/(cx-ox)]):[ex,ay];
  if(none){const v=[P(f)-ex,ay-ty],m=Math.hypot(...v);[[ex,ty],h3].forEach((p,i)=>{if(!p)return;const c=RC[i?2:0];ln([ox,ty],p,c);ln(p,[p[0]+v[0]/m*900,p[1]+v[1]/m*900],c)});
   arrow(ox,ty,0,C("--ink"));tag("Object",ox,ty,C("--ink"));q(".out").innerHTML=`<b>No image.</b> The object is right at F, so the ${mirror?"reflected":"refracted"} rays come out parallel and never meet.`;return}
  const ix=P(di),iy=ay-M*h*ky,real=di>0;
  const out=(hx,hy,c)=>{const vx=ix-hx,vy=iy-hy,m=Math.hypot(vx,vy)||1;if(real)ln([hx,hy],[ix+vx/m*300,iy+vy/m*300],c);else{ln([hx,hy],[hx-vx/m*900,hy-vy/m*900],c);ln([hx,hy],[ix,iy],"#888",1)}};
  [[ex,ty],[ex,iy],h3].forEach((p,i)=>{if(!p)return;ln([ox,ty],p,C("--ray"));out(p[0],p[1],"#2f6fd0")});
  arrow(ox,ty,0,C("--ray"));tag("Object",ox,ty,C("--ray"));arrow(ix,iy,!real,C("--ac"));tag("Image ("+(real?"real":"virtual")+")",ix,iy,C("--ac"));
  const sz=Math.abs(Math.abs(M)-1)<.02?"the same size":Math.abs(M)>1?"larger":"smaller",where=mirror?(real?", in front of the mirror":", behind the mirror"):(real?", on the other side of the lens":", on the same side as the object");
  q(".out").innerHTML=`<div class=nums><span>dᵢ = <b>${di.toFixed(1)} cm</b></span><span>M = <b>${M.toFixed(2)}</b></span><span>hᵢ = <b>${(M*h).toFixed(2)} cm</b></span></div>The image is <b>${real?"real":"virtual"}, ${M<0?"inverted":"upright"}, and ${sz}</b>${where}.`}
 root.addEventListener("input",d);
 if(!fx){const mv=e=>{if(!fr)return;const b=cv.getBoundingClientRect(),px=(e.clientX-b.left)*800/b.width;q(".d").value=Math.min(+q(".d").max,Math.max(1,(fr.ex-px)/fr.kx));d()};
  cv.addEventListener("pointerdown",e=>{fr=lv;try{cv.setPointerCapture(e.pointerId)}catch(_){}mv(e)});cv.addEventListener("pointermove",mv);
  ["pointerup","pointercancel"].forEach(t=>cv.addEventListener(t,()=>{if(fr){fr=null;d()}}))}
 else{q(".f").value=fx[0];q(".d").value=fx[1];q(".h").value=fx[2];q(".ctl").hidden=true;(window.FXS=window.FXS||[]).push(d)}
 d();d.root=root;d.set=(f,o,h)=>{q(".f").value=f;q(".d").value=o;q(".h").value=h;d()};return d}
/* two diagrams with shared sliders and a shared scale */
function compare(root,mirror){const n=mirror?["Concave mirror","Convex mirror"]:["Converging lens","Diverging lens"];
 root.innerHTML=`<div class=ctl><label>Focal length |f|: <b></b> cm<input class=f type=range min=3 max=50 step=.1 value=10></label><label>Object distance dₒ: <b></b> cm<input class=d type=range min=1 max=80 step=.1 value=15></label><label>Object height hₒ: <b></b> cm<input class=h type=range min=.5 max=6 step=.1 value=3></label></div>`+n.map((t,i)=>`<h4 class="ch${i?" b":""}">${t}</h4><div class=cs></div>`).join("");
 const q=s=>root.querySelector(s),sh={},[a,b]=[...root.querySelectorAll(".cs")].map((el,i)=>sim(el,mirror,i?-1:1,[10,15,3],sh));
 function d(){[".f",".d",".h"].forEach(s=>q(s).previousElementSibling.textContent=(+q(s).value).toFixed(1));const v=[+q(".f").value,+q(".d").value,+q(".h").value];a.set(...v);b.set(...v);a()}
 root.querySelector(".ctl").addEventListener("input",d);d();return d}
