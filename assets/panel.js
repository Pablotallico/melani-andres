(() => {
'use strict';
const guests=window.INVITADOS,cfg=window.BODA,reminder=document.body.dataset.mode==='recordatorio';
const $=s=>document.querySelector(s),norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const ids=new Set();
if(guests.some(g=>!g.id||ids.has(g.id)||!ids.add(g.id)||!g.nombre||!Number.isInteger(g.cupos)||g.cupos<1||g.cupos>30)){
 $('[data-notice]').textContent='Revisa los IDs, nombres y cupos de la lista.';return;
}
const base=new URL(cfg.baseUrl?cfg.baseUrl.replace(/\/$/,'')+'/':'./',location.href);
const local=base.protocol==='file:'||['localhost','127.0.0.1'].includes(base.hostname);
const url=g=>{const u=new URL(reminder?'recordatorio.html':'index.html',base);u.search=new URLSearchParams({id:g.id,titulo:g.titulo||'',nombre:g.nombre,cupos:g.cupos,tipo:g.tipo||''});return u.href;};
const message=g=>[g.titulo+' '+g.nombre,'',reminder?'¡Nos vemos muy pronto!':'¡Nos casamos!','Andrés y Melani · 19 de diciembre de 2026 · 15h00','Quinta La Corteza, Valle de los Chillos','Vestimenta: formal elegante','Cupos reservados: '+g.cupos,'',url(g),'','Confirma hasta el 1 de octubre de 2026.'].join('\n');
let responses=new Map(),loaded=false,busy=false,visible=[];
const labels={si:'Confirmado',no:'No asistirá',pendiente:'Pendiente'};
const value=g=>responses.get(g.id)?.respuesta||'pendiente';
const display=g=>loaded?labels[value(g)]:'Sin sincronizar';
const notice=$('[data-notice]');
async function copy(text){try{await navigator.clipboard.writeText(text);$('#panel-status').textContent='Copiado.';}catch{$('#panel-status').textContent='No se pudo copiar. Usa la descarga CSV.';}}
[...new Set(guests.map(g=>g.grupo))].sort().forEach(group=>{const o=document.createElement('option');o.value=o.textContent=group;$('#group').append(o);});
$('[data-total]').textContent=guests.length;
$('[data-seats-total]').textContent=guests.reduce((s,g)=>s+g.cupos,0);
function render(){
 const confirmed=guests.filter(g=>value(g)==='si'),declined=guests.filter(g=>value(g)==='no');
 $('#stat-si').textContent=loaded?confirmed.length:'—';
 $('#stat-seats-si').textContent=loaded?confirmed.reduce((s,g)=>s+g.cupos,0):'—';
 $('#stat-no').textContent=loaded?declined.length:'—';
 $('#stat-pending').textContent=loaded?guests.length-confirmed.length-declined.length:'—';
 visible=guests.filter(g=>norm(g.nombre).includes(norm($('#search').value))&&(!$('#group').value||g.grupo===$('#group').value)&&(!$('#response-filter').value||(loaded&&value(g)===$('#response-filter').value))).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
 $('[data-visible]').textContent=visible.length;
 $('#export').disabled=local||!visible.length;$('#empty').hidden=!!guests.length;$('#table-wrap').hidden=!guests.length;$('#rows').replaceChildren();
 if(guests.length&&!visible.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=5;td.textContent='No hay invitados que coincidan con los filtros.';tr.append(td);$('#rows').append(tr);}
 visible.forEach(g=>{
 const tr=document.createElement('tr');
 [g.titulo+' '+g.nombre,g.grupo,String(g.cupos)].forEach(t=>{const td=document.createElement('td');td.textContent=t;tr.append(td);});
 const state=document.createElement('td'),badge=document.createElement('span');badge.textContent=display(g);badge.className='rsvp-badge '+(loaded?value(g):'unknown');state.append(badge);
 const date=responses.get(g.id)?.fecha;
 if(date&&!Number.isNaN(new Date(date).getTime())){const small=document.createElement('small');small.textContent=new Date(date).toLocaleString('es-EC',{timeZone:'America/Guayaquil'});state.append(small);}
 tr.append(state);
 const td=document.createElement('td'),a=document.createElement('a');a.href=url(g);a.target='_blank';a.rel='noopener';a.textContent='Abrir ↗';td.append(a);
 [['Copiar enlace',url(g)],['Copiar mensaje',message(g)]].forEach(([label,t])=>{const b=document.createElement('button');b.textContent=label;b.disabled=local;b.addEventListener('click',()=>copy(t));td.append(b);});
 tr.append(td);$('#rows').append(tr);
 });
}
function request(){
 return new Promise((resolve,reject)=>{
 const cb='boda_'+Date.now()+'_'+Math.random().toString(36).slice(2),s=document.createElement('script');
 const clean=()=>{clearTimeout(timer);s.remove();delete window[cb];};
 const timer=setTimeout(()=>{clean();reject(new Error('Tiempo agotado'));},15000);
 window[cb]=result=>{clean();resolve(result);};s.onerror=()=>{clean();reject(new Error('Error de conexión'));};
 const endpoint=new URL(cfg.rsvpEndpoint);endpoint.search=new URLSearchParams({action:'list',callback:cb,t:Date.now()});s.src=endpoint.href;document.body.append(s);
 });
}
async function refresh(){
 if(!cfg.rsvpEndpoint){notice.textContent='Falta conectar Google Sheets. Los enlaces ya están listos; los estados aún no están sincronizados.';$('#refresh').disabled=true;return;}
 if(busy)return;busy=true;$('#refresh').disabled=true;notice.textContent='Consultando respuestas…';
 try{
 const result=await request();if(!result?.ok||!Array.isArray(result.responses))throw new Error('Respuesta inválida');
 const next=new Map();
 result.responses.forEach(r=>{if(ids.has(String(r.id))&&['si','no'].includes(r.respuesta))next.set(String(r.id),r);});
 responses=next;loaded=true;render();
 notice.textContent='Actualizado a las '+new Date().toLocaleTimeString('es-EC')+'. Actualización automática cada 30 segundos.';
 }catch{notice.textContent=loaded?'No se pudo actualizar. Se muestran los últimos datos recibidos; reintentaremos automáticamente.':'No se pudo conectar. Los estados todavía son desconocidos; pulsa Actualizar para reintentar.';}
 finally{busy=false;$('#refresh').disabled=false;}
}
['#search','#group','#response-filter'].forEach(s=>$(s).addEventListener(s==='#search'?'input':'change',render));
$('#refresh').addEventListener('click',refresh);
$('#export').addEventListener('click',()=>{
 const quote=v=>'"'+String(v).replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';
 const rows=[['ID','Invitado','Grupo','Cupos','Estado','Enlace'],...visible.map(g=>[g.id,g.nombre,g.grupo,g.cupos,display(g),url(g)])];
 const link=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(quote).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=link;a.download=reminder?'recordatorios.csv':'invitaciones.csv';a.click();setTimeout(()=>URL.revokeObjectURL(link),1000);
});
render();refresh();
setInterval(()=>{if(!document.hidden)refresh();},30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();

