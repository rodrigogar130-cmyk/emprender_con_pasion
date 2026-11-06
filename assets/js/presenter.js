import {MODULES,CLOSING_NOTES} from './content.js';
const $=s=>document.querySelector(s);
const isOffline=location.protocol==='file:';
const local=[{label:'INICIO',title:'Emprender con Pasión',notes:'Da la bienvenida. Explica que la ponencia es un recorrido práctico, no una promesa de éxito automático.'}];
for(const m of MODULES)for(let i=0;i<3;i++)local.push({label:`MÓDULO ${m.n}`,title:m.title,notes:m.notes[i]});
CLOSING_NOTES.forEach((notes,i)=>local.push({label:'CIERRE',title:['Todo comienza con una idea','Decide actuar','¿Qué vas a construir tú?'][i],notes}));
local.push({label:'SOBRE MÍ',title:'Presentación del ponente',notes:'Habla brevemente de experiencia, capacitación, consultoría y proyectos de innovación.'},{label:'CONTACTO',title:'Conectemos ideas',notes:'Invita a conectar por WhatsApp, Instagram o portafolio.'});
let index=0,lastConnection=0;const channel=('BroadcastChannel' in window)?new BroadcastChannel('ecp-presentacion-v1'):null;
function render(data){index=data.index??index;const active=local[index]||local[0];$('#label').textContent=data.label||active.label;$('#title').textContent=data.title||active.title;$('#notes').textContent=data.notes||active.notes;$('#next').textContent=data.upcoming||local[index+1]?.title||'Final de la presentación';$('#counter').textContent=`${String(index+1).padStart(2,'0')} / ${String(data.total||local.length).padStart(2,'0')}`;$('#connection-dot').classList.add('active');$('#connection').textContent='CONECTADO A LA PROYECCIÓN';lastConnection=Date.now();}
function dispatch(data){if(isOffline&&window.opener&&!window.opener.closed)window.opener.postMessage(data,'*');else if(channel)channel.postMessage(data);else $('#connection').textContent='CONEXIÓN NO DISPONIBLE';}
if(isOffline){window.addEventListener('message',event=>{if(event.source===window.opener&&event.data?.type==='state')render(event.data);});dispatch({type:'hello'});}
else if(channel){channel.addEventListener('message',event=>{if(event.data?.type==='state')render(event.data);});dispatch({type:'hello'});}
$('#prev').addEventListener('click',()=>dispatch({type:'step',offset:-1}));
$('#forward').addEventListener('click',()=>dispatch({type:'step',offset:1}));
$('#reset').addEventListener('click',()=>dispatch({type:'navigate',index:0}));
$('#fs').addEventListener('click',()=>dispatch({type:'fullscreen'}));
document.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key===' '){event.preventDefault();dispatch({type:'step',offset:1});}if(event.key==='ArrowLeft'){event.preventDefault();dispatch({type:'step',offset:-1});}if(event.key==='Home'){event.preventDefault();dispatch({type:'navigate',index:0});}});
const started=Date.now();setInterval(()=>{const elapsed=Math.floor((Date.now()-started)/1000);$('#clock').textContent=`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(elapsed%60).padStart(2,'0')}`;if(lastConnection&&Date.now()-lastConnection>30e3){$('#connection-dot').classList.remove('active');$('#connection').textContent='SIN ACTUALIZACIONES RECIENTES';dispatch({type:'hello'});}},1000);
