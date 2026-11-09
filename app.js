/* Shell, routing, sidebar, labs, quiz and leaderboard. */
const svg=(p,extra="")=>`<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${p}</svg>`;
const I={home:svg('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),book:svg('<path d="M12 6c-2-1.5-5-2-9-2v15c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2z"/><path d="M12 6v15"/>'),quiz:svg('<path d="M6 2h9l4 4v16H6z"/><path d="M9 11h6M9 15h6M9 19h3"/>'),bars:svg('<path d="M5 21v-6M12 21V9M19 21V3"/>'),bulb:svg('<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.2 1 2.3h6c0-1.1.4-1.8 1-2.3A7 7 0 0012 2z"/>'),sun:svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),min:svg('<path d="M15 3v18"/><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M10 9l-3 3 3 3"/>'),max:svg('<path d="M9 3v18"/><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M14 9l3 3-3 3"/>'),chev:svg('<path d="M6 9l6 6 6-6"/>','data-chev'),left:svg('<circle cx="12" cy="12" r="10"/><path d="M12 8l-4 4 4 4M8 12h8"/>'),right:svg('<circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M16 12H8"/>'),arrow:svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),back:svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),trophy:svg('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0z"/><path d="M7 5H3v2a4 4 0 004 4M17 5h4v2a4 4 0 01-4 4"/>'),clock:svg('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M10 2h4"/>'),retry:svg('<path d="M3 12a9 9 0 109-9 9 9 0 00-7 3L3 8"/><path d="M3 3v5h5"/>'),dl:svg('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),ul:svg('<path d="M12 15V3M7 8l5-5 5 5M5 21h14"/>'),menu:svg('<path d="M3 6h18M3 12h18M3 18h18"/>'),user:svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>')};
const logo=`<span class="prism" aria-hidden="true"></span>`;
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const byId=Object.fromEntries(LESSONS.map(l=>[l.id,l]));
const ORDER=LESSONS.map(l=>l.id).concat("examples","quiz");
let openGroups=new Set(),current="home";
let visited=new Set(store.get("optics-visited",[]));

/* ----- Theme ----- */
function setTheme(t){document.documentElement.dataset.theme=t;store.set("optics-theme",t)}
const savedTheme=store.get("optics-theme",null);if(savedTheme)document.documentElement.dataset.theme=savedTheme;
function toggleTheme(){const d=document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");setTheme(d==="dark"?"light":"dark");redrawAll()}

/* ----- Home ----- */
$("#landing").innerHTML=`<header class="lnav"><b class="brand">${logo}OPTICS LAB</b><nav><button data-t="home">Home</button><button data-t="lessons">Lessons</button><button data-t="quiz">Quizzes</button><button class="pill" data-t="lessons">Get Started</button><button class="iconbtn" data-theme-toggle aria-label="Toggle theme">${I.sun}</button></nav></header>
<section class="hero"><div><h1>PLAY WITH<br>LIGHT BEFORE<br>YOU<br>MEMORIZE IT.</h1><p>Learn optics through interactive lessons and experiments.</p><div class="row"><button class="btn dark" data-t="lessons">Start Lesson</button><button class="btn ghost" data-t="quiz">Jump to Quiz</button></div></div>
<figure class="plate"><svg viewBox="0 0 360 220" role="img" aria-label="White light passing through a prism and splitting into colors"><path d="M0 132L118 104" stroke="#111" stroke-width="3"/><g stroke-width="5"><path d="M196 110L360 52" stroke="#d62828"/><path d="M196 112L360 76" stroke="#f28a00"/><path d="M196 114L360 100" stroke="#f2c500"/><path d="M196 116L360 124" stroke="#2bb673"/><path d="M196 118L360 148" stroke="#1fa3ec"/><path d="M196 120L360 172" stroke="#2a5bd7"/><path d="M196 122L360 196" stroke="#7b2cbf"/></g><path d="M118 104L196 116" stroke="#111" stroke-width="2.5"/><path d="M155 30L232 178H78z" fill="#e9e6ff" fill-opacity=".7" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/></svg><figcaption><b>Fig. 0</b> White light through a glass prism. Each color bends by a different amount.</figcaption></figure></section>
<footer class="lfoot">CALPHY ++ | BS COMPUTER SCIENCE 3A</footer>`;

/* ----- Sidebar: rendered once, same content on every page ----- */
const NAV=[["home","Home",I.home],["lessons","Lessons",I.book],["quiz","Quizzes",I.quiz],["progress","Progress",I.bars]];
$("#side").innerHTML=`<b class="brand">${logo}<span class="lbl">OPTICS LAB</span></b>
<nav class="mainnav">${NAV.map(n=>`<button data-t="${n[0]}" title="${n[1]}">${n[2]}<span class="lbl">${n[1]}</span></button>`).join("")}</nav><hr>
<p class="side-h lbl">LESSONS</p>
<nav class="lessonnav">${GROUPS.map((g,i)=>`<div class="grp" data-g="${i}"><button class="grp-b" data-group="${i}" aria-expanded="false" title="${g.t}">${I.bulb}<span class="lbl">${g.t}</span><span class="lbl chev">${I.chev}</span></button><div class="sub">${LESSONS.filter(l=>l.g===i).map(l=>`<button data-t="${l.id}">${l.n} ${l.t}</button>`).join("")}</div></div>`).join("")}</nav>
<div class="side-b"><hr><button data-theme-toggle title="Theme">${I.sun}<span class="lbl">Theme</span></button><button id="minBtn" title="Minimize">${I.min}<span class="lbl">Minimize</span></button></div>`;
$(".brand-sm").innerHTML=logo+"OPTICS LAB";$("#openMenu").innerHTML=I.menu;

function setMin(on){document.body.classList.toggle("mini",on);store.set("optics-mini",on);const b=$("#minBtn");b.innerHTML=(on?I.max:I.min)+`<span class="lbl">Minimize</span>`;b.title=on?"Expand sidebar":"Minimize";b.setAttribute("aria-label",b.title);b.setAttribute("aria-pressed",on)}
setMin(store.get("optics-mini",false));
function drawer(on){document.body.classList.toggle("drawer",on);$("#openMenu").setAttribute("aria-expanded",on)}
function syncGroups(){document.querySelectorAll(".grp").forEach(g=>{const o=openGroups.has(+g.dataset.g);g.classList.toggle("open",o);g.querySelector(".grp-b").setAttribute("aria-expanded",o)})}

/* ----- Pages ----- */
const nav2=(pId,nId)=>{const lab=i=>i==="lessons"?"Lessons":i==="examples"?"Examples":i==="quiz"?"Quiz":byId[i].t;return`<div class="pn"><button data-t="${pId}">${I.left}${lab(pId)}</button>${nId?`<button data-t="${nId}">${lab(nId)}${I.right}</button>`:"<span></span>"}</div>`};
const banner=(small,big)=>`<div class="banner"><span class="cloud l"></span><span class="cloud r"></span><p>${small}</p><h1>${big}</h1></div>`;
$("#main").innerHTML=
`<section id="lessons" hidden><div class="crumb"><span>Home › <b>Lessons</b></span><span>${GROUPS.length} sections</span></div>
<div class="hero-card"><small>COURSE · OPTICS LAB</small><h1>Lessons</h1><p>Pick a part to start learning</p></div>
<div class="toc"><h2>WHAT’S INSIDE</h2><div class="toc-grid">${GROUPS.map((g,i)=>{const L=LESSONS.filter(l=>l.g===i);return`<button class="toc-c" style="--c:${g.c}" data-t="${L[0].id}"><small>PART ${i+1}</small><span class="a">${I.arrow}</span><b>${g.t}</b><ul>${L.map(l=>`<li>${l.n} ${l.t}</li>`).join("")}</ul></button>`}).join("")}</div></div></section>`+
LESSONS.map(l=>{const i=ORDER.indexOf(l.id),p=i?ORDER[i-1]:"lessons",n=ORDER[i+1],nv=nav2(p,n);
 return`<section id="${l.id}" hidden>${nv}${banner(`Lesson ${l.n} · ${GROUPS[l.g].t}`,l.title)}
 <div class="objs">${l.obj.map((o,k)=>`<div class="obj"><small>OBJECTIVE ${k+1}</small><b>${o}</b></div>`).join("")}</div>
 <h2>DISCUSSION</h2><div class="panel"><div class="${l.key?"disc":""}"><div>${l.disc}</div>${l.key?`<aside class="kf"><h3>Key Formula</h3>${l.key}</aside>`:""}</div>${l.more?`<div class="more">${l.more}</div>`:""}</div>
 ${l.ex?`<h2>WORKED EXAMPLE</h2><div class="panel">${l.ex}</div>`:""}
 ${l.tryIt?`<h2>TRY IT YOURSELF</h2><div class="panel">${l.tryIt}</div>`:""}
 ${l.how?`<h3 class="howh">HOW TO USE IT</h3>${ol(l.how)}`:""}${l.extra||""}${nv}</section>`}).join("")+
`<section id="examples" hidden><div class="crumb"><span>Quizzes › <b>Worked examples</b></span></div>${banner("Practice · Optics","Worked Examples")}<div id="ex"></div>${nav2(LESSONS[LESSONS.length-1].id,"quiz")}</section>
<section id="quiz" hidden><div class="crumb"><span>Quizzes › <b>Optics practice</b></span><span id="qstate">Ready to begin</span></div>
<div class="hero-card"><small>PRACTICE · OPTICS</small><h1>Quiz: Image Formation and Optical Instruments</h1></div><div id="qb"></div><div class="pn bare"><button data-t="examples">${I.back}Previous: Examples</button></div></section>
<section id="progress" hidden><div class="crumb"><span>Home › <b>Progress</b></span></div><div class="hero-card"><small>YOUR PROGRESS</small><h1>Progress</h1><p>Saved on this browser</p></div><div id="pg"></div></section>`;

function show(id){
 if(id!=="home"&&!document.getElementById(id))id="home";
 current=id;const home=id==="home";$("#landing").hidden=!home;$("#shell").hidden=home;
 document.querySelectorAll("#main>section").forEach(s=>s.hidden=s.id!==id);
 const l=byId[id];if(l){openGroups=new Set([l.g]);if(!visited.has(id)){visited.add(id);store.set("optics-visited",[...visited])}}
 syncGroups();
 const top=l?"lessons":id==="examples"?"quiz":id;
 document.querySelectorAll(".mainnav button").forEach(b=>b.setAttribute("aria-current",b.dataset.t===top));
 document.querySelectorAll(".sub button").forEach(b=>b.setAttribute("aria-current",b.dataset.t===id));
 document.body.classList.toggle("white",id==="quiz");drawer(false);scrollTo(0,0);
 if(id==="progress")renderProgress();if(id==="quiz")live();
 if(location.hash.slice(1)!==id)location.hash=id;
 if(l)redrawAll();
}
addEventListener("hashchange",()=>{const h=location.hash.slice(1)||"home";if(h!==current)show(h)});
document.addEventListener("click",e=>{
 const t=e.target.closest("[data-t]");if(t){show(t.dataset.t);return}
 if(e.target.closest("[data-theme-toggle]")){toggleTheme();return}
 const g=e.target.closest("[data-group]");
 if(g){const i=+g.dataset.group;if(document.body.classList.contains("mini")){setMin(false);openGroups.add(i)}else{openGroups.has(i)?openGroups.delete(i):openGroups.add(i)}syncGroups();return}
 if(e.target.closest("#minBtn")){setMin(!document.body.classList.contains("mini"));return}
 if(e.target.closest("#openMenu")){drawer(!document.body.classList.contains("drawer"));return}
 if(e.target.id==="scrim")drawer(false);
});

/* ----- Progress ----- */
function renderProgress(){const p=me();$("#pg").innerHTML=`<div class="panel"><h3>Lessons</h3>${GROUPS.map((g,i)=>{const L=LESSONS.filter(l=>l.g===i),d=L.filter(l=>visited.has(l.id)).length;return`<div class="pg"><div><b>${g.t}</b><span>${d} of ${L.length}</span></div><i><u style="width:${100*d/L.length}%"></u></i></div>`}).join("")}<h3 class="sp">Quiz</h3><p>${p&&p.attempts?`<b>${esc(p.name)}</b>: best score <b>${p.best}/${NQ}</b> after ${p.attempts} attempt${p.attempts>1?"s":""}.`:"No quiz attempts yet."}</p><button class="btn red" data-t="quiz">${I.arrow}Go to the quiz</button></div>`}

/* ----- Mirror / lens lab (Figma "Try it yourself" layout), wraps the simulators ----- */
const DRAW=[];function redrawAll(){DRAW.forEach(f=>f());(window.FXS||[]).forEach(f=>f())}
const POS={mirror:[["Beyond C",3],["At C",2],["C to F",1.5],["At F",1],["Inside F",.5]],lens:[["Beyond 2F",3],["At 2F",2],["2F to F",1.5],["At F",1],["Inside F",.5]]};
function lab(root){const kind=root.dataset.lab,mirror=kind==="mirror",modes=mirror?[["plane","Plane"],["concave","Concave"],["convex","Convex"]]:[["converging","Converging"],["diverging","Diverging"]];
 let mode=root.dataset.mode,api,start=root.dataset.start?root.dataset.start.split(",").map(Number):null;
 root.className="lab";root.innerHTML=`<div class="lab-top"><div class="seg">${modes.map(m=>`<button data-m="${m[0]}">${m[1]}</button>`).join("")}</div><div class="chips" aria-live="polite"></div></div><div class="presets"></div><div class="slot"></div><div class="lab-foot"><span class="chk"></span><button class="btn ghost sm" data-ang hidden>Show angles</button><button class="btn ghost sm" data-reset>Reset</button></div>`;
 const q=s=>root.querySelector(s),slot=q(".slot");
 const curved=()=>mode!=="plane",sg=()=>mode==="concave"||mode==="converging"?1:-1;
 function read(){if(!curved()){const o=+slot.querySelector("input").value;return{o,di:-o,M:1}}const f=sg()*+slot.querySelector(".f").value,o=+slot.querySelector(".d").value,g=1/f-1/o;if(Math.abs(g)<1e-3)return{o,f,none:true};const di=1/g;return{o,f,di,M:-di/o}}
 const n=(v,d=1)=>(v>0?"+":v<0?"−":"")+Math.abs(v).toFixed(d);
 function upd(){const r=read();let c;if(r.none)c=[`<b>NO IMAGE</b>`];else{const real=r.di>0,sz=Math.abs(Math.abs(r.M)-1)<.02?"Same size":Math.abs(r.M)>1?"Larger":"Smaller";c=[`<b>${real?"REAL":"VIRTUAL"}</b>`,r.M<0?"Inverted":"Upright",sz,`dᵢ = ${n(r.di)} cm`,`M = ${n(r.M,2)}`]}
  q(".chips").innerHTML=`<em>Image:</em>`+c.map(x=>`<span>${x}</span>`).join("");
  q(".chk").textContent=r.none?`Check: dₒ = ${r.o.toFixed(1)} cm = f, so the rays leave parallel.`:`Check: dₒ = ${r.o.toFixed(1)} cm${r.f!=null?`, f = ${n(r.f)} cm`:""} → dᵢ = ${n(r.di)} cm, M = ${n(r.M,2)}`}
 function build(vals){delete slot.dataset.angles;q("[data-ang]").hidden=mode!=="plane";slot.innerHTML="";root.querySelectorAll("[data-m]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===mode));
  api=curved()?sim(slot,mirror?1:0,sg()):plane(slot);
  const showPos=mode==="concave"||mode==="converging";q(".presets").hidden=!showPos;q(".presets").innerHTML=showPos?`<em>Object position:</em>`+POS[kind].map(p=>`<button data-k="${p[1]}">${p[0]}</button>`).join(""):"";
  if(vals&&api.set)api.set(...vals);upd()}
 root.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.m){mode=b.dataset.m;build();return}if(b.dataset.k){const f=+slot.querySelector(".f").value;api.set(f,f*+b.dataset.k,+slot.querySelector(".h").value);upd();return}if(b.hasAttribute("data-ang")){slot.dataset.angles?delete slot.dataset.angles:slot.dataset.angles=1;api();return}if(b.hasAttribute("data-reset"))build(start)});
 ["input","pointermove","pointerdown"].forEach(ev=>slot.addEventListener(ev,upd));
 build(start);
 const self={el:root,redraw:()=>api(),load(m,f,o,h){mode=m;build([f,o,h])}};DRAW.push(self.redraw);return self}

const LABS={};document.querySelectorAll("[data-lab]").forEach(el=>{const s=el.closest("section").id,m=el.dataset.mode,l=lab(el);LABS[s]=l;void m});
const wT1=tracer($("#t1"),1),wT2=tracer($("#t2"),2,0,2),wT3=tracer($("#t3"),2,2,0),wM=compare($("#cmpM"),1),wL=compare($("#cmpL"),0);DRAW.push(wT1,wT2,wT3,wM,wL);

/* ----- EM Spectrum Explorer ----- */
(function(){const B=[["Radio waves",0,.18,1e4,3e9,"#566a8c","oscillator circuits","AM/FM radio"],["Microwaves",.18,.31,3e9,3e11,"#5f86c2","klystron tubes","microwave ovens"],["Infrared",.31,.445,3e11,4e14,"#bb4242","molecular vibration","TV remotes"],["Visible",.445,.52,4e14,7.9e14,"","very hot objects","what our eyes see"],["Ultraviolet",.52,.645,7.9e14,3e16,"#7a52c2","electric arcs","UV sterilizers"],["X-rays",.645,.787,3e16,3e19,"#463f92","fast electrons stopping","medical X-rays"],["Gamma rays",.787,1,3e19,1e24,"#25234f","nuclear decay","radiotherapy"]];
 const el=$("#spec"),DEF=.4825;el.innerHTML=`<div class="ex-box"><div class="ex-bar">${B.map(b=>`<span style="flex:${(b[2]-b[1])*100};background:${b[5]||"linear-gradient(90deg,#e23,#f90,#ee0,#3b5,#28d,#73c)"}">${b[5]?b[0]:""}</span>`).join("")}<input type="range" min="0" max="1000" aria-label="Position on the electromagnetic spectrum"></div><div class="ex-grid"><div class="ex-w"><small>Wave preview</small><canvas width="560" height="150"></canvas></div><div class="ex-r"></div></div></div><div class="presets jump"><em>Jump to:</em>${B.map((b,i)=>`<button data-j="${i}">${b[0]==="Visible"?"Visible":b[0]}</button>`).join("")}<button class="ghosty" data-j="r">Reset</button></div>`;
 const r=el.querySelector("input"),cv=el.querySelector("canvas"),x=cv.getContext("2d"),out=el.querySelector(".ex-r");
 const sup=s=>String(s).replace(/[-0-9]/g,c=>"⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(c)]);
 const sci=(v,d=1)=>{const e=Math.floor(Math.log10(v));return`${(v/10**e).toFixed(d)} × 10${sup(e)}`};
 const wl=v=>v>=1?v.toFixed(v<10?1:0)+" m":v>=1e-3?(v*1e3).toFixed(1)+" mm":v>=1e-6?(v*1e6).toFixed(1)+" µm":v>=1e-9?(v*1e9).toFixed(0)+" nm":(v*1e12).toFixed(2)+" pm";
 function vis(nm){const c=[[700,"#d62828","red"],[620,"#f28a00","orange"],[580,"#e7c500","yellow"],[530,"#2bb673","green"],[480,"#1f8fe0","blue"],[440,"#3f4bd0","indigo"],[0,"#7b2cbf","violet"]];return c.find(k=>nm>=k[0]-((k[0]===700)?60:0))||c[6]}
 function d(){const p=r.value/1000,b=B.find(a=>p<=a[2])||B[6],t=(p-b[1])/(b[2]-b[1]),f=10**(Math.log10(b[3])+t*(Math.log10(b[4])-Math.log10(b[3]))),L=3e8/f,v=vis(L*1e9),col=b[5]||v[1],name=b[5]?b[0]:`Visible light (${v[2]})`;
  out.innerHTML=`<h4><i style="background:${col}"></i>${name}</h4><dl><dt>Frequency</dt><dd>${sci(f)} Hz</dd><dt>Wavelength</dt><dd>${wl(L)}</dd><dt>Produced by</dt><dd>${b[6]}</dd><dt>Example</dt><dd>${b[7]}</dd></dl><span class="chip">λ = c / f = (3.00 × 10⁸) / (${sci(f)})</span>`;
  x.clearRect(0,0,560,150);const cyc=2+p*18;x.strokeStyle=col==="#25234f"?C("--ink"):col;x.lineWidth=3;x.beginPath();for(let i=0;i<=560;i++){const y=70-52*Math.sin(i/560*cyc*2*Math.PI);i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke();x.strokeStyle=C("--line");x.lineWidth=1;x.beginPath();x.moveTo(0,140);x.lineTo(560,140);x.stroke();
  el.querySelectorAll("[data-j]").forEach(j=>j.setAttribute("aria-pressed",j.dataset.j!=="r"&&B[+j.dataset.j]===b))}
 r.addEventListener("input",d);el.addEventListener("click",e=>{const j=e.target.dataset.j;if(j==null)return;r.value=j==="r"?DEF*1000:(B[+j][1]+B[+j][2])*500;d()});r.value=DEF*1000;d();DRAW.push(d)})();

/* ----- Wavefronts and rays (Lesson 1.2) ----- */
(function(){const el=$("#wf");el.innerHTML=`<div class="ctl"><label>Distance from source: <b></b><input type="range" min="0" max="100" value="15"></label></div><div class="stage"><canvas width="800" height="300"></canvas></div><div class="out"></div>`;const r=el.querySelector("input"),cv=el.querySelector("canvas"),x=cv.getContext("2d");
 function d(){const t=r.value/100,R=120+t*t*3800,sx=420-R,cy=150;x.clearRect(0,0,800,300);
  x.strokeStyle=C("--ac");x.lineWidth=2.5;for(let k=-3;k<=4;k++){const rr=R+k*62;if(rr<8)continue;x.beginPath();x.arc(sx,cy,rr,-Math.PI/2,Math.PI/2);x.stroke()}
  x.strokeStyle=C("--ray");x.lineWidth=2;for(const a of[-2,-1,0,1,2]){const y0=cy+a*62,th=Math.atan2(y0-cy,R),L=1600;const px=sx+Math.cos(th)*Math.max(4,R-250),py=cy+Math.sin(th)*Math.max(4,R-250);x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(th)*L,py+Math.sin(th)*L);x.stroke()}
  if(sx>-10){x.fillStyle=C("--ink");x.beginPath();x.arc(sx,cy,7,0,7);x.fill()}
  el.querySelector("b").textContent=t<.25?"near":t<.65?"medium":"far";
  el.querySelector(".out").innerHTML=t<.25?"<b>Near the source.</b> The wavefronts are curved and the rays spread apart.":t<.65?"<b>Moving away.</b> The wavefronts flatten and the rays spread less.":"<b>Far from the source.</b> The wavefronts look flat and the rays are nearly parallel."}
 r.addEventListener("input",d);d();DRAW.push(d)})();

/* ----- Worked examples ----- */
const SIMS={concave:"concave",convex:"convex",converging:"converging"};
$("#ex").innerHTML=EX.map((e,i)=>`<div class="panel exc"><b class="red">Sample ${i+1}.</b> ${e[0]}<p>${e[1]}</p><button class="btn red sm" data-i="${i}">${e[2]?"Load in the "+e[3]+" lab":"Open the Snell’s Law lesson"}</button></div>`).join("");
$("#ex").addEventListener("click",e=>{const b=e.target.closest("[data-i]");if(!b)return;const x=EX[+b.dataset.i];if(x[2]){LABS[x[3]].load(x[3],...x[2]);show(x[3]);LABS[x[3]].el.scrollIntoView({block:"center"})}else show("snell")});

/* ----- Quiz and leaderboard ----- */
const KEY="optics-board-v2",NQ=Q.length,TOP=10;let B={players:{},me:null},qs,qi,ans,t0,done,locked=false,lbTimer,retry=null;const RESULT_MS=900;
B=store.get(KEY,B);if(!B||!B.players)B={players:{},me:null};
const save=()=>store.set(KEY,B),me=()=>B.players[B.me],pid=n=>n.trim().toLowerCase().replace(/\s+/g," ");
const fmtT=s=>s<60?s+"s":Math.floor(s/60)+"m "+String(s%60).padStart(2,"0")+"s";
const qs_=(s)=>{$("#qstate").textContent=s};

/* Ranked by best score, then fastest time for that score. Identical results share a rank. */
function ranked(){const R=Object.entries(B.players).filter(r=>r[1].attempts>0).sort((a,b)=>b[1].best-a[1].best||a[1].time-b[1].time||a[1].date-b[1].date);let last=0;return R.map((r,i)=>{const prev=R[i-1];const rank=prev&&prev[1].best===r[1].best&&prev[1].time===r[1].time?last:i+1;last=rank;return{id:r[0],p:r[1],rank}})}
function board(){const R=ranked(),n=R.length,mine=R.find(r=>r.id===B.me);
 if(!n)return`<h3 class="lbh">${I.trophy}Leaderboard</h3><div class="panel empty">No scores yet. Finish the quiz to claim the top spot.</div>`+lbTools();
 const row=r=>`<tr class="${r.id===B.me?"you":""}"><td><span class="rk">${r.rank}</span></td><td>${r.id===B.me?`<b>${esc(r.p.name)} (you)</b>`:esc(r.p.name)}</td><td><b>${r.p.best}/${NQ}</b> <span class="mute">(${Math.round(100*r.p.best/NQ)}%)</span></td><td>${fmtT(r.p.time)}</td><td>${r.p.attempts}</td></tr>`;
 const top=R.slice(0,TOP),extra=mine&&!top.includes(mine);
 const avg=R.reduce((t,r)=>t+r.p.best,0)/n,below=mine?R.filter(r=>r.p.best<mine.p.best||(r.p.best===mine.p.best&&r.p.time>mine.p.time)).length:0;
 const sum=(mine?`Your rank: <b>${mine.rank} of ${n}</b>. `:"")+`Class average: <b>${avg.toFixed(1)}/${NQ}</b>.`+(mine&&n>1?` You are ahead of <b>${Math.round(100*below/(n-1))}%</b> of the other players.`:"");
 return`<h3 class="lbh">${I.trophy}Leaderboard</h3><div class="tw lb"><table><thead><tr><th>Rank</th><th>Name</th><th>Best Score</th><th>Time</th><th>Attempts</th></tr></thead><tbody>${top.map(row).join("")}${extra?`<tr class="gap"><td colspan="5">⋯</td></tr>${row(mine)}`:""}</tbody></table></div><div class="lbsum">${I.bars}<span>${sum}</span></div>`+lbTools()}
const lbTools=()=>BOARD_URL?`<p class="note">Everyone’s scores appear here, on every device, and update automatically.</p>`:`<p class="note">This leaderboard lists the players who used this browser. Export your scores and import files from other computers to combine them.</p><div class="row"><button class="btn ghost" id="exp">${I.dl}Export Scores</button><label class="btn ghost" tabindex="0">${I.ul}Import Scores<input id="imp" type="file" accept="application/json" hidden></label></div>`;
const lbBox=()=>`<div id="lbw">${board()}</div><p class="note bad" id="lbst"></p>`;
const setSt=h=>{const e=$("#lbst");if(e)e.innerHTML=h};
const paint=()=>{const w=$("#lbw");if(w)w.innerHTML=board()};
/* Shared scores. Remote data is untrusted, so every record is checked before use. */
function clean(v){if(!v||typeof v.name!=="string"||!v.name.trim()||!Number.isInteger(v.best)||v.best<0||v.best>NQ||!(v.time>=0))return null;return{name:v.name.slice(0,24),best:v.best,time:+v.time,attempts:Math.max(1,Math.floor(+v.attempts)||1),date:+v.date||0}}
async function pull(){const r=await fetch(BOARD_URL+"/scores.json",{cache:"no-store"});if(!r.ok)throw new Error("read");const d=await r.json()||{},fresh={};for(const[k,v]of Object.entries(d)){const c=clean(v);if(c)fresh[k]=c}if(B.me&&!fresh[B.me]&&B.players[B.me])fresh[B.me]=B.players[B.me];B.players=fresh;save()}
async function live(){clearTimeout(lbTimer);if(!BOARD_URL||current!=="quiz"||!$("#lbw"))return;try{await pull();paint();if(!retry)setSt("")}catch(e){if(!retry)setSt("Can’t reach the online leaderboard right now. Showing the last scores loaded.")}lbTimer=setTimeout(live,8000)}
async function submit(k,sc,tm){if(!BOARD_URL)return;const name=B.players[k].name;try{const u=BOARD_URL+"/scores/"+encodeURIComponent(k)+".json",r=await fetch(u,{cache:"no-store"});if(!r.ok)throw new Error("read");const p=clean(await r.json())||{name,best:-1,time:0,attempts:0,date:0};p.attempts++;if(sc>p.best||(sc===p.best&&tm<p.time)){p.best=sc;p.time=tm;p.date=Date.now()}const w=await fetch(u,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)});if(!w.ok)throw new Error("write");B.players[k]=p;save();paint();live()}catch(e){retry={k,sc,tm};setSt(`Your score didn’t reach the online leaderboard. <button class="btn ghost sm" id="rt">Try again</button>`)}}
/* After Next: lock the answer, color it, then move on. The pause doesn't count toward the time. */
function reveal(){locked=true;const q=qs[qi],o=ans[qi],right=o===q[2];document.querySelectorAll(".opt").forEach((b,i)=>{b.disabled=true;if(i===o)b.classList.add(right?"right":"wrong")});$("#nx").disabled=true;setTimeout(()=>{t0+=RESULT_MS;if(current!=="quiz"&&qi<NQ-1){qi++;ask();return}qi<NQ-1?(qi++,ask()):fin()},RESULT_MS)}

function gate(msg){qs_("Ready to begin");const p=me();$("#qb").innerHTML=`<div class="qh"><h2 class="q-t">Ready to test your understanding?</h2><span class="badge">${NQ} questions</span></div><div class="panel soft"><h3>Let’s get started</h3><p class="mute">Enter your name so your score can appear on the leaderboard.</p><label class="field">YOUR NAME<span class="inp">${I.user}<input id="nm" maxlength="24" autocomplete="off" placeholder="Enter your name" value="${p?esc(p.name):""}"></span></label><p class="small ${msg?"bad":"mute"}">${msg||"Use 2 to 24 letters, spaces, or hyphens."}</p><div class="row"><button class="btn red" id="go">${I.arrow}Start Quiz</button><button class="btn ghost" id="lb">${I.trophy}View Leaderboard</button></div></div>`}
function start(){qs=[...Q].map(v=>[v,Math.random()]).sort((a,b)=>a[1]-b[1]).map(v=>v[0]);qi=0;ans=Array(NQ).fill(null);t0=Date.now();done=false;ask()}
function ask(){locked=false;qs_("Quiz in progress");const q=qs[qi];$("#qb").innerHTML=`<div class="qp"><span>Question ${qi+1} of ${NQ}</span><span>Select one answer</span></div><div class="bar"><u style="width:${100*(qi+1)/NQ}%"></u></div><div class="panel soft"><h3 class="qq">${q[0]}</h3><div role="radiogroup">${q[1].map((o,i)=>`<button class="opt" role="radio" aria-checked="${ans[qi]===i}" data-o="${i}"><span class="lt">${"ABCD"[i]}</span>${o}<span class="rd"></span></button>`).join("")}</div></div><div class="row end"><button class="btn red" id="nx" ${ans[qi]==null?"disabled":""}>${I.arrow}${qi<NQ-1?"Next question":"See score"}</button></div>`}
function fin(){if(done)return;done=true;const tm=Math.round((Date.now()-t0)/1000),sc=ans.reduce((t,a,i)=>t+(a===qs[i][2]?1:0),0),p=me();p.attempts++;if(sc>p.best||(sc===p.best&&tm<p.time)){p.best=sc;p.time=tm;p.date=Date.now()}save();qs_("Quiz complete");
 const pct=Math.round(100*sc/NQ),msg=sc>=12?"Strong work.":sc>=8?"Solid. Review the lessons for the ones you missed.":"Revisit the simulators, then try again.";
 $("#qb").innerHTML=`<div class="panel soft score"><div><small>YOUR SCORE</small><div class="big"><b>${sc}</b> / ${NQ}</div><b>${pct}%</b></div><div><h3>${esc(p.name)} <span class="time">${I.clock}${fmtT(tm)}</span></h3><p class="mute">${msg}</p><button class="btn red" id="again">${I.retry}Retake Quiz</button></div></div>${lbBox()}`;submit(B.me,sc,tm)}

$("#qb").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const id=b.id;
 if(id==="go"){const v=($("#nm").value||"").trim();if(!/^[A-Za-z][A-Za-z '\-]{1,23}$/.test(v))return gate("That name is not valid. Use 2 to 24 letters, spaces, or hyphens.");const k=pid(v);if(!B.players[k])B.players[k]={name:v,best:-1,time:0,attempts:0,date:0};B.me=k;save();start()}
 else if(id==="lb"){$("#qb").innerHTML=lbBox()+`<div class="row sp"><button class="btn red" id="bk">${I.back}Back</button></div>`;live()}
 else if(id==="bk")gate();
 else if(id==="again")start();
 else if(id==="nx"&&ans[qi]!=null&&!locked)reveal();
 else if(id==="rt"&&retry){const r=retry;retry=null;setSt("");submit(r.k,r.sc,r.tm)}
 else if(b.dataset.o!=null&&!locked){ans[qi]=+b.dataset.o;document.querySelectorAll(".opt").forEach(o=>o.setAttribute("aria-checked",o===b));$("#nx").disabled=false}
 else if(id==="exp"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(B.players,null,1)],{type:"application/json"}));a.download="optics-scores.json";a.click()}});
$("#qb").addEventListener("change",e=>{if(e.target.id!=="imp"||!e.target.files[0])return;e.target.files[0].text().then(t=>{const d=JSON.parse(t);for(const p of Object.values(d)){if(!p||typeof p.name!=="string"||!(p.best>=0&&p.best<=NQ)||!(p.time>=0))continue;const k=pid(p.name),c={name:p.name.slice(0,24),best:+p.best,time:+p.time,attempts:Math.max(1,+p.attempts||1),date:+p.date||0},o=B.players[k];if(!o||!o.attempts)B.players[k]=c;else{const att=Math.max(o.attempts,c.attempts);if(c.best>o.best||(c.best===o.best&&c.time<o.time))B.players[k]=Object.assign(c,{attempts:att});else o.attempts=att}}save();$("#qb").innerHTML=lbBox()+`<div class="row sp"><button class="btn red" id="bk">${I.back}Back</button></div>`}).catch(()=>alert("That file could not be read."))});
$("#qb").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="nm")$("#go").click()});

gate();
const h0=location.hash.slice(1);show(h0||"home");
