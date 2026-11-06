import {MODULES, BIO, CLOSING_NOTES} from './content.js';

const $ = (sel,root=document) => root.querySelector(sel);
const $$ = (sel,root=document) => [...root.querySelectorAll(sel)];
const clamp = (x,min=0,max=1) => Math.max(min,Math.min(max,x));
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const chaptersRoot = $('#chapters');
const safeText = (s) => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let positions = [], selectedIndex = 0, lastRenderedIndex = -1;
let manualPause = false, rafQueued = false, toastTimer;
let navTarget=-1, navDeadline=0;
let mainChannel;
let presenterPopup=null;

function polar(cx,cy,r,degrees){const a=degrees*Math.PI/180;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];}
function dots(center=250,radius=153,count=10){return Array.from({length:count},(_,i)=>{const [x,y]=polar(center,center,radius,i*360/count-90);return `<circle class="art-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i%3===0?5:3}" fill="${i%3===0?'#ff9a55':'#f9d4aa'}" opacity=".75" style="animation-delay:${(i*.27).toFixed(1)}s"/>`}).join('');}
function linesBetween(nodes,edges){return edges.map(([a,b])=>`<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="#ffb17a" stroke-width="1.5" opacity=".4"/>`).join('');}
function artwork(kind) {
  const start='<svg viewBox="0 0 500 500" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow"><stop stop-color="#ff9d55" stop-opacity=".35"/><stop offset="1" stop-color="#ff9d55" stop-opacity="0"/></radialGradient><linearGradient id="stroke" x1="0" y1="0" x2="500" y2="500"><stop stop-color="#ffe3bf"/><stop offset=".5" stop-color="#ff9653"/><stop offset="1" stop-color="#b54a28"/></linearGradient></defs>';
  const end='</svg>';
  if(kind==='heart')return start+`<circle cx="250" cy="250" r="225" stroke="#ff9147" opacity=".17" class="orbit-ring reveal-stroke"/><circle cx="250" cy="250" r="188" stroke="#ff9147" opacity=".15"/><circle cx="250" cy="250" r="162" fill="url(#glow)" class="art-halo"/><path class="art-heart" d="M250 371C173 307 120 263 120 205c0-37 29-66 65-66 31 0 51 17 65 39 14-22 35-39 65-39 36 0 65 29 65 66 0 58-53 102-130 166Z" stroke="url(#stroke)" stroke-width="4" fill="#ff9147" fill-opacity=".1"/>`+dots()+end;
  if(kind==='network'){
    const nodes=[[95,131],[189,94],[324,94],[413,166],[130,274],[245,246],[364,293],[194,396],[349,420],[78,390]];
    const edges=[[0,1],[1,2],[2,3],[0,4],[1,5],[2,5],[2,3],[3,6],[4,5],[5,6],[4,7],[5,7],[5,8],[6,8],[7,9],[4,9]];
    return start+`<circle cx="247" cy="252" r="215" stroke="#ff9147" stroke-dasharray="3 13" opacity=".28" class="orbit-ring"/>${linesBetween(nodes,edges)}${nodes.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===5?15:7}" fill="${i===5?'#ff9953':'#15110e'}" stroke="#ffae73" stroke-width="2" opacity="${i===5?1:.9}"/><circle cx="${x}" cy="${y}" r="${i===5?31:15}" stroke="#ffae73" opacity=".23"/>`).join('')}<circle cx="245" cy="246" r="80" fill="url(#glow)"/>`+end;
  }
  if(kind==='energy'){
    return start+`<circle cx="250" cy="250" r="230" stroke="#ff9147" stroke-dasharray="1 17" opacity=".5" class="orbit-ring"/><circle cx="250" cy="250" r="192" stroke="#ff9147" stroke-width="2" opacity=".14"/><circle cx="250" cy="250" r="147" stroke="url(#stroke)" stroke-width="3" opacity=".65" class="orbit-ring reverse reveal-stroke"/><circle cx="250" cy="250" r="110" stroke="#ff9147" opacity=".34"/><circle cx="250" cy="250" r="78" fill="url(#glow)" class="art-halo"/><circle class="art-core" cx="250" cy="250" r="22" fill="#ff9653"/>${Array.from({length:18},(_,i)=>{const [a,b]=polar(250,250,124,i*20);const[c,d]=polar(250,250,i%3===0?220:182,i*20);return `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#ffac76" stroke-width="${i%3===0?2:1}" opacity=".5"/>`}).join('')}`+end;
  }
  if(kind==='roadmap'){
    const labels=['01','02','03','04','05'];const xs=[55,149,243,337,431];
    return start+`<path d="M55 250H430" stroke="#ff9147" stroke-width="2" stroke-dasharray="6 11" opacity=".8"/><path d="M55 240V139H242V250H430V340H339" stroke="#ff9147" stroke-width="1" opacity=".18"/><circle cx="250" cy="250" r="190" stroke="#ff9147" opacity=".13" class="orbit-ring reveal-stroke"/>${xs.map((x,i)=>`<circle cx="${x}" cy="250" r="${i===2?27:18}" fill="#15120f" stroke="${i===2?'#ffe0b4':'#ff9147'}" stroke-width="2"/><text x="${x}" y="256" font-family="Arial" fill="#ffd0a5" font-size="${i===2?15:12}" text-anchor="middle" font-weight="bold">${labels[i]}</text>`).join('')}<circle cx="243" cy="250" r="78" fill="url(#glow)"/>`+end;
  }
  if(kind==='leadership'){
    const points=Array.from({length:5},(_,i)=>polar(250,250,172,i*72-90));
    return start+`<circle cx="250" cy="250" r="215" stroke="#ff9147" opacity=".17" stroke-dasharray="2 12" class="orbit-ring"/><circle cx="250" cy="250" r="175" stroke="#ff9147" opacity=".3"/><circle cx="250" cy="250" r="80" fill="url(#glow)"/>${points.map(([x,y],i)=>`<line x1="250" y1="250" x2="${x}" y2="${y}" stroke="#ffbc81" opacity=".45"/><circle cx="${x}" cy="${y}" r="${i===0?15:10}" fill="#1c1310" stroke="#ffab72" stroke-width="2"/><circle cx="${x}" cy="${y}" r="25" stroke="#ffab72" opacity=".18"/>`).join('')}<circle cx="250" cy="204" r="27" stroke="url(#stroke)" stroke-width="3"/><path d="M186 332c1-39 25-72 64-72s63 33 64 72" stroke="url(#stroke)" stroke-width="3"/>`+end;
  }
  const points=Array.from({length:11},(_,i)=>{const r=i%2===0?177:115;return polar(250,250,r,i*360/11-90)});
  return start+`<circle cx="250" cy="250" r="219" stroke="#ff9147" opacity=".25"/><circle cx="250" cy="250" r="140" stroke="#ff9147" opacity=".2" class="orbit-ring reveal-stroke"/><circle cx="250" cy="250" r="87" fill="url(#glow)"/>${points.map(([x,y],i)=>`<line x1="250" y1="250" x2="${x}" y2="${y}" stroke="#ff9147" stroke-width="1.3" opacity=".4"/><circle cx="${x}" cy="${y}" r="${i%3===0?9:5}" fill="${i%3===0?'#ffad75':'#f1d5b6'}"/><circle cx="${x}" cy="${y}" r="22" stroke="#ff9147" opacity=".14"/>`).join('')}<circle cx="250" cy="250" r="25" fill="#ff9a55" class="art-core"/>`+end;
}

function moduleHTML(m){
  return `<section class="chapter scroll-story" id="${m.id}" data-kind="module" data-index="${Number(m.n)-1}" aria-label="Módulo ${m.n}: ${safeText(m.title)}">
    <div class="story-sticky chapter-sticky">
      <div class="chapter-topline"><span class="chapter-label">MÓDULO ${m.n} <span style="color:#fff;opacity:.4;padding:0 9px">/</span> ${safeText(m.eyebrow)}</span><span class="chapter-step">EMPRENDER CON PASIÓN — ${m.n} / 06</span></div>
      <div class="chapter-index-large" aria-hidden="true">${m.n}</div>
      <div class="chapter-art">${artwork(m.art)}</div>
      <div class="story-scene intro-scene" data-scene="0"><div class="chapter-intro-copy"><div class="chapter-kicker">CAPÍTULO ${m.n} / 03 ESCENAS</div><h2 class="chapter-intro-title">${m.titleLines.map(s=>`<span>${safeText(s)}</span>`).join('')}</h2><p class="chapter-intro-sub">${safeText(m.outro)}</p></div></div>
      <div class="story-scene words-scene" data-scene="1"><div class="words-content"><span class="micro-label">MÓDULO ${m.n} / LO ESENCIAL</span><h2 class="words-headline">CONCEPTOS QUE <span>IMPORTAN.</span></h2><div class="words-grid">${m.words.map((w,i)=>`<span class="word-chip ${w===m.focus?'focus-word':''}" data-word="${i}">${safeText(w)}</span>`).join('')}</div><div class="words-foot">DESLIZA Y DESCUBRE CADA CONCEPTO</div>${m.art==='roadmap'?'<div class="pipeline" aria-label="Secuencia de validación"><span>IDEA</span><b>→</b><span>CLIENTE</span><b>→</b><span>VALIDACIÓN</span><b>→</b><span>MVP</span><b>→</b><span>MEJORA</span></div>':''}</div></div>
      <div class="story-scene reflection-scene" data-scene="2"><div class="reflection-content"><div class="reflection-overline">PREGUNTA PARA LLEVARTE / ${m.n}</div><span class="quote-mark" aria-hidden="true">“</span><h2 class="reflection-quote">${safeText(m.quote)}</h2><p class="reflection-foot">${safeText(m.outro)}</p>${m.art==='roadmap'?'<div class="validation-widget" role="group" aria-label="Reflexión sobre tu idea"><strong>¿TU IDEA RESUELVE UN PROBLEMA REAL?</strong><div class="validation-buttons"><button type="button" data-validate="si" aria-pressed="false">SÍ</button><button type="button" data-validate="no" aria-pressed="false">AÚN NO SÉ</button></div><p class="validation-answer" aria-live="polite"></p></div>':''}</div></div>
      <div class="chapter-bottomline"><span>DE UNA IDEA A UNA REALIDAD.</span><strong>EXPLORA / 0${m.n==='06'?6:Number(m.n)}</strong></div>
    </div>
  </section>`;
}

function buildPage(){
  chaptersRoot.innerHTML=MODULES.map(moduleHTML).join('');
  $('#bio-container').innerHTML=BIO.map(p=>`<p>${safeText(p)}</p>`).join('');
  $('#module-nav').innerHTML=MODULES.map(m=>`<button type="button" class="rail-dot" data-module="${m.id}" aria-label="Ir al módulo ${m.n}"><span class="rail-tooltip">${m.n} · ${safeText(m.title)}</span></button>`).join('');
  $$('.rail-dot').forEach(b=>b.addEventListener('click',()=>gotoModule(b.dataset.module)));
  $$('[data-validate]').forEach(button=>button.addEventListener('click',()=>{
    const parent=button.closest('.validation-widget');
    $$('[data-validate]',parent).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    $('.validation-answer',parent).textContent=button.dataset.validate==='si'?'Perfecto: compruébalo hablando con clientes reales.':'Tu siguiente paso: conversa con cinco personas que podrían necesitar tu solución.';
  }));
}

function absoluteTop(el){return el.getBoundingClientRect().top + window.scrollY;}
function computePositions(){
  positions=[{key:'inicio',type:'intro',scene:0,label:'INICIO',title:'Emprender con Pasión',notes:'Da la bienvenida. Explica que la ponencia es un recorrido práctico, no una promesa de éxito automático.',y:0}];
  MODULES.forEach((m,mi)=>{
    const el=document.getElementById(m.id);
    const top=absoluteTop(el),range=Math.max(0,el.offsetHeight-innerHeight);
    [0,.5,1].forEach((part,si)=>positions.push({key:`${m.id}-${si}`,type:'module',module:mi,scene:si,label:`MÓDULO ${m.n}`,title:m.title,notes:m.notes[si],y:Math.round(top+range*part)}));
  });
  const fin=$('#cierre');const fTop=absoluteTop(fin),fRange=Math.max(0,fin.offsetHeight-innerHeight);
  [0,.5,1].forEach((part,si)=>positions.push({key:`cierre-${si}`,type:'closing',scene:si,label:'CIERRE',title:['Todo comienza con una idea','Decide actuar','¿Qué vas a construir tú?'][si],notes:CLOSING_NOTES[si],y:Math.round(fTop+fRange*part)}));
  for(const [key,title] of [['ponente','SOBRE MÍ'],['contacto','CONTACTO']]){positions.push({key,type:key,scene:0,label:title,title,notes:key==='ponente'?'Presenta brevemente tu experiencia y destaca que emprender combina aprendizaje, acompañamiento y ejecución.':'Invita al público a continuar la conversación por WhatsApp, Instagram y portafolio.',y:Math.round(absoluteTop(document.getElementById(key)))});}
}
function frameWeights(progress){
  const centers=[0,.5,1];
  const weights=centers.map(c=>clamp(1-Math.abs(progress-c)/.37));
  return weights;
}
function renderStory(el,progress){
  const scenes=$$('.story-scene',el);const weights=frameWeights(progress);
  scenes.forEach((scene,i)=>{
    const weight=weights[i];
    scene.style.opacity=String(weight);
    scene.style.transform=`translate3d(0,${Math.round((1-weight)*33)}px,0) scale(${(.975+.025*weight).toFixed(4)})`;
    scene.classList.toggle('is-visible',weight>.58);
    scene.setAttribute('aria-hidden',weight>.58?'false':'true');
    if ('inert' in scene) scene.inert=weight<=.58;
  });
  const revealWords=$$('.word-chip',el);
  revealWords.forEach((word,i)=>{
    const visible=clamp((progress-(.22+i*.035))/.105);
    word.style.opacity=String(visible);
    word.style.transform=`translate3d(0,${(1-visible)*30}px,0)`;
  });
  if(el.dataset.kind==='module'){
    const art=$('.chapter-art',el);art.style.transform=`translate3d(0,-50%,0) rotate(${(progress*16-7).toFixed(1)}deg)`;
  }
}
function closestIndex(y){
  let nearest=0,smallest=Infinity;
  for(let i=0;i<positions.length;i++){const dist=Math.abs(positions[i].y-y);if(dist<smallest){smallest=dist;nearest=i;}}
  return nearest;
}
function frame(){
  rafQueued=false;
  const y=window.scrollY;
  $$('.scroll-story').forEach(el=>{
    const rect=el.getBoundingClientRect(),range=el.offsetHeight-innerHeight;
    if(rect.bottom < -100 || rect.top > innerHeight+100)return;
    renderStory(el,clamp(-rect.top/Math.max(1,range)));
  });
  const nearest=closestIndex(y);
  const inTransit=navTarget>=0 && Date.now()<navDeadline && Math.abs(y-positions[navTarget]?.y)>18;
  if(!inTransit){navTarget=-1;if(nearest!==lastRenderedIndex){lastRenderedIndex=nearest;selectedIndex=nearest;updateUI();}}
  $('#site-header').classList.toggle('is-scrolled',y>42);
  const total=document.documentElement.scrollHeight-innerHeight;
  $('#rail-progress').style.height=`${Math.round(clamp(y/Math.max(1,total))*100)}%`;
}
function queueFrame(){if(!rafQueued){rafQueued=true;requestAnimationFrame(frame);}}
function updateUI(){
  const current=positions[selectedIndex];if(!current)return;
  $('#current-scene-label').textContent=current.label;
  const local=current.type==='module'?String(current.scene+1).padStart(2,'0'):'01';
  $('#current-scene-count').textContent=`${local} — 03`;
  $('#announce').textContent=`${current.label}: ${current.title}. Escena ${current.scene+1}`;
  $$('.rail-dot').forEach((b)=>b.classList.toggle('is-active',current.type==='module'&&b.dataset.module===MODULES[current.module].id));
  sendState();
}
function jumpTo(index,behavior){
  selectedIndex=clamp(index,0,positions.length-1);
  navTarget=selectedIndex;navDeadline=Date.now()+1900;
  const item=positions[selectedIndex];
  window.scrollTo({top:item.y,behavior:behavior??(prefersReduced?'instant':'smooth')});
  updateUI();
}
function gotoModule(id){const idx=positions.findIndex(p=>p.key===`${id}-0`);if(idx>=0)jumpTo(idx);}
function advance(offset){jumpTo(selectedIndex+offset);}
function toast(text){const box=$('#toast');box.textContent=text;box.classList.add('is-showing');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('is-showing'),3400);}
function togglePause(force){manualPause=typeof force==='boolean'?force:!manualPause;document.body.classList.toggle('motion-paused',manualPause);$('#motion-toggle').textContent=manualPause?'▶':'Ⅱ';$('#motion-toggle').setAttribute('aria-label',manualPause?'Reanudar animaciones':'Pausar animaciones');$('#motion-toggle').title=manualPause?'Reanudar animaciones':'Pausar animaciones';if(window.gsap)window.gsap.globalTimeline.paused(manualPause);toast(manualPause?'Animaciones ambientales pausadas. Puedes seguir navegando.':'Animaciones reanudadas.');}
async function toggleFullscreen(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{toast('Activa pantalla completa desde el navegador (F11).');}}
function openPresenter(){
  const presenterPath=location.protocol==='file:'?'presenter-offline.html':'presenter.html';
  const popup=window.open(presenterPath,'ecp-notas','width=1000,height=720,menubar=no,toolbar=no');
  if(!popup){toast('Permite ventanas emergentes para abrir las notas del ponente.');return;}
  presenterPopup=popup;popup.focus();setTimeout(sendState,250);
}
function sendState(){
  if(!mainChannel&&location.protocol!=='file:')return;
  const entry=positions[selectedIndex];if(!entry)return;
  const payload={type:'state',index:selectedIndex,total:positions.length,label:entry.label,title:entry.title,scene:entry.scene,notes:entry.notes,upcoming:positions[selectedIndex+1]?.title||'Fin de la presentación'};
  if(location.protocol==='file:'){if(presenterPopup&&!presenterPopup.closed)presenterPopup.postMessage(payload,'*');}
  else if(mainChannel)mainChannel.postMessage(payload);
}
function handlePresenterCommand(data){
  if(data.type==='hello')sendState();
  if(data.type==='navigate'&&Number.isFinite(data.index))jumpTo(data.index);
  if(data.type==='step'&&Number.isFinite(data.offset))advance(data.offset);
  if(data.type==='fullscreen')toggleFullscreen();
}
function listenToPresenter(){
  if(location.protocol==='file:'){window.addEventListener('message',event=>{if(event.source===presenterPopup)handlePresenterCommand(event.data||{});});return;}
  if(!('BroadcastChannel' in window))return;
  mainChannel=new BroadcastChannel('ecp-presentacion-v1');
  mainChannel.addEventListener('message',(event)=>handlePresenterCommand(event.data||{}));
}
function bindEvents(){
  window.addEventListener('scroll',queueFrame,{passive:true});
  window.addEventListener('wheel',()=>{navTarget=-1;},{passive:true});
  window.addEventListener('touchstart',()=>{navTarget=-1;},{passive:true});
  window.addEventListener('resize',()=>{computePositions();queueFrame();},{passive:true});
  window.addEventListener('load',()=>{computePositions();queueFrame();});
  $('#previous-scene').addEventListener('click',()=>advance(-1));
  $('#next-scene').addEventListener('click',()=>advance(1));
  $('#motion-toggle').addEventListener('click',()=>togglePause());
  $('#pause-reflection').addEventListener('click',()=>togglePause());
  $('#fullscreen-toggle').addEventListener('click',toggleFullscreen);
  $('#presenter-open').addEventListener('click',openPresenter);
  document.addEventListener('keydown',(event)=>{
    const el=event.target;
    if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(el?.tagName)||el?.isContentEditable)return;
    if(event.ctrlKey||event.metaKey||event.altKey)return;
    if(['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)){event.preventDefault();advance(1);}
    else if(['ArrowLeft','ArrowUp','PageUp'].includes(event.key)){event.preventDefault();advance(-1);}
    else if(event.key==='Home'){event.preventDefault();jumpTo(0);}
    else if(event.key==='End'){event.preventDefault();jumpTo(positions.length-1);}
    else if(event.key.toLowerCase()==='f'){event.preventDefault();toggleFullscreen();}
    else if(event.key.toLowerCase()==='p'){event.preventDefault();togglePause();}
    else if(event.key.toLowerCase()==='n'){event.preventDefault();openPresenter();}
  });
  window.addEventListener('pointermove',event=>{
    if(innerWidth<800||prefersReduced)return;
    $('.cursor-glow').style.transform=`translate3d(${event.clientX-235}px,${event.clientY-235}px,0)`;
  },{passive:true});
}
function loadScript(src,timeout=4000){
  return new Promise((resolve,reject)=>{
    const tag=document.createElement('script');tag.src=src;tag.async=true;
    let settled=false;
    const done=(error)=>{if(settled)return;settled=true;clearTimeout(timer);if(error){tag.remove();reject(error);}else resolve();};
    const timer=setTimeout(()=>done(new Error('La librería opcional tardó demasiado')),timeout);
    tag.onload=()=>done();tag.onerror=()=>done(new Error('No se pudo cargar la librería'));
    document.head.append(tag);
  });
}
async function loadOptionalAnimation(){
  if(prefersReduced)return;
  try{
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
    activateGSAP();
  }catch{ /* Modo offline: scroll storytelling nativo, sin fallar ni bloquear la página. */ }
}
function activateGSAP(){
  if(!window.gsap||prefersReduced)return;
  const gsap=window.gsap;
  try{
    if(window.scrollY<100){
      gsap.from('.hero-eyebrow,.hero-pretitle,.hero-title>span,.hero-subtitle,.hero-author,.hero-scroll',{opacity:0,y:29,duration:1.05,stagger:.085,ease:'power3.out',clearProps:'transform,opacity',delay:.1});
      gsap.from('.hero-photo-wrap',{opacity:0,y:45,scale:.97,duration:1.35,ease:'power3.out',clearProps:'transform,opacity',delay:.3});
    }
    if(window.ScrollTrigger){
      gsap.registerPlugin(window.ScrollTrigger);
      for(const selector of ['.interlude-inner','.about-grid','.contact-inner']){
        gsap.from(selector,{scrollTrigger:{trigger:selector,start:'top 88%',once:true},opacity:0,y:48,duration:1.15,ease:'power3.out',clearProps:'opacity,transform'});
      }
    }
  }catch(err){console.warn('La animación GSAP no está disponible. Se utiliza animación nativa.',err);}
}
buildPage();
computePositions();
listenToPresenter();
bindEvents();
frame();
loadOptionalAnimation();
