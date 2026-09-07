(() => {
  'use strict';
  const reminder=document.body.dataset.mode==='recordatorio';const guests=window.INVITADOS;const cfg=window.BODA;
  const $=s=>document.querySelector(s);const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const ids=new Set();const invalid=guests.some(g=>{if(!g.id||!/^[a-zA-Z0-9_-]+$/.test(g.id)||ids.has(String(g.id))||!g.nombre||!Number.isInteger(g.cupos)||g.cupos<1||g.cupos>30)return true;ids.add(String(g.id));return false;});
  if(invalid){$('[data-notice]').textContent='Revisa la lista: cada invitado necesita un ID único, nombre y entre 1 y 30 cupos.';return;}
  const base=cfg.baseUrl?new URL(cfg.baseUrl.replace(/\/$/,'')+'/'):new URL('./',location.href);
  const local=base.protocol==='file:'||['localhost','127.0.0.1'].includes(base.hostname);
  $('[data-notice]').textContent=local?'Vista local: configura la dirección pública del sitio antes de compartir enlaces.':cfg.rsvpEndpoint?'Enlaces listos para compartir. Las respuestas se consultan en la hoja Respuestas de Google Sheets.':'Los enlaces están listos. Falta conectar Google Sheets para recibir confirmaciones.';
  function url(g){const u=new URL(reminder?'recordatorio.html':'index.html',base);u.search=new URLSearchParams({id:g.id,titulo:g.titulo||'',nombre:g.nombre,cupos:g.cupos,tipo:g.tipo||''});return u.href;}
  function message(g){return `${[g.titulo,g.nombre].filter(Boolean).join(' ')}\n\n${reminder?'¡Nos vemos muy pronto!':'¡Nos casamos!'} Andrés y Melanie te invitan a celebrar su boda.\n19 de diciembre de 2026 · 15h00\nQuinta La Corteza, Valle de los Chillos\nVestimenta: formal elegante\nCupos reservados: ${g.cupos}\n\n${url(g)}\n\n${reminder?'Gracias por compartir este día con nosotros.':'Por favor, confirma tu asistencia hasta el 1 de octubre de 2026.'}`;}
  async function copy(text){try{await navigator.clipboard.writeText(text);$('#panel-status').textContent='Copiado.';}catch{$('#panel-status').textContent='No se pudo copiar automáticamente. Abre el enlace o usa la descarga CSV.';}}
  [...new Set(guests.map(g=>g.grupo||'Sin grupo'))].sort((a,b)=>a.localeCompare(b,'es')).forEach(group=>{const option=document.createElement('option');option.value=group;option.textContent=group;$('#group').append(option);});
  $('[data-total]').textContent=guests.length;$('[data-seats-total]').textContent=guests.reduce((sum,g)=>sum+g.cupos,0);
  let visible=[];
  function render(){
    visible=guests.filter(g=>normalize(g.nombre).includes(normalize($('#search').value))&&(!$('#group').value||(g.grupo||'Sin grupo')===$('#group').value)).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
    $('[data-visible]').textContent=visible.length;$('#export').disabled=local||!visible.length;$('#empty').hidden=!!guests.length;$('#table-wrap').hidden=!guests.length;$('#rows').replaceChildren();
    if(guests.length&&!visible.length){const tr=document.createElement('tr');const td=document.createElement('td');td.colSpan=4;td.textContent='No hay invitados que coincidan con la búsqueda.';tr.append(td);$('#rows').append(tr);}
    visible.forEach(g=>{const row=document.createElement('tr');[`${g.titulo||''} ${g.nombre}`.trim(),g.grupo||'Sin grupo',String(g.cupos)].forEach(text=>{const td=document.createElement('td');td.textContent=text;row.append(td);});const actions=document.createElement('td');const a=document.createElement('a');a.href=url(g);a.target='_blank';a.rel='noopener';a.textContent='Abrir ↗';actions.append(a);[['Copiar enlace',url(g)],['Copiar mensaje',message(g)]].forEach(([label,text])=>{const b=document.createElement('button');b.textContent=label;b.disabled=local;b.addEventListener('click',()=>copy(text));actions.append(b);});row.append(actions);$('#rows').append(row);});
  }
  $('#search').addEventListener('input',render);$('#group').addEventListener('change',render);
  $('#export').addEventListener('click',()=>{const quote=value=>'"'+String(value).replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';const rows=[['ID','Nombre','Grupo','Cupos','Enlace'],...visible.map(g=>[g.id,g.nombre,g.grupo||'',g.cupos,url(g)])];const blob=new Blob(['\uFEFF'+rows.map(row=>row.map(quote).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=reminder?'recordatorios.csv':'invitaciones.csv';a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);});
  render();
})();
