(() => {
  'use strict';
  const cover = document.getElementById('invitation-cover');
  if (cover && typeof cover.showModal === 'function' && !location.hash) {
    const openButton = document.getElementById('open-invitation');
    cover.showModal();
    document.body.classList.add('cover-open');
    openButton.addEventListener('click', () => cover.close());
    cover.addEventListener('close', () => {
      document.body.classList.remove('cover-open');
      const heading = document.querySelector('.hero h1');
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    });
  }
  const cfg = window.BODA;
  const params = new URLSearchParams(location.search);
  const guest = {id:(params.get('id') || '').slice(0,80), nombre:(params.get('nombre') || '').slice(0,150), titulo:(params.get('titulo') || '').slice(0,20), cupos:Number(params.get('cupos')), tipo:(params.get('tipo') || '').slice(0,30)};
  const validGuest = /^[a-zA-Z0-9_-]+$/.test(guest.id) && !!guest.nombre.trim() && Number.isInteger(guest.cupos) && guest.cupos > 0 && guest.cupos <= 30;
  document.querySelectorAll('[data-guest]').forEach(el => { if(guest.nombre){el.textContent = [guest.titulo,guest.nombre].filter(Boolean).join(' ');el.hidden=false;} });
  document.querySelectorAll('[data-seats]').forEach(el => {if(validGuest){el.textContent=`Hemos reservado ${guest.cupos} ${guest.cupos === 1 ? 'cupo para ti' : 'cupos para ustedes'}.`;el.hidden=false;}});
  document.querySelectorAll('[data-map]').forEach(el => el.href=cfg.mapaUrl || 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(cfg.lugar));
  document.querySelectorAll('[data-full-invite]').forEach(el => el.href='index.html'+location.search);
  const calendar = new URL('https://calendar.google.com/calendar/render');
  calendar.search = new URLSearchParams({action:'TEMPLATE',text:'Boda de Andrés & Melanie',dates:'20261219T200000Z/20261219T210000Z',ctz:'America/Guayaquil',location:cfg.lugar,details:'Inicio de nuestra celebración: boda civil 15h00; boda eclesiástica 16h00; fotos y cócteles 17h00; cena 19h00; fiesta 20h00. El horario del calendario corresponde al inicio, no a la duración de la celebración. Vestimenta: formal elegante.'});
  document.querySelectorAll('[data-google-calendar]').forEach(el=>el.href=calendar.href);
  document.querySelectorAll('[data-apple-calendar]').forEach(el=>el.addEventListener('click',()=>{
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Melani y Andres//Boda//ES','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:melani-andres-20261219@invitacion','DTSTAMP:20260907T000000Z','DTSTART:20261219T200000Z','SUMMARY:Boda de Andrés & Melanie','LOCATION:Quinta La Corteza\\, Valle de los Chillos\\, Ecuador','DESCRIPTION:Boda civil 15h00. Boda eclesiástica 16h00. Fotos y cócteles','  17h00. Cena 19h00. Fiesta 20h00. Vestimenta: formal elegante.','END:VEVENT','END:VCALENDAR',''].join('\r\n');
    const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='boda-melani-andres.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }));
  function tick(){
    const diff=Math.max(0,new Date(cfg.fecha).getTime()-Date.now());
    const values=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
    document.querySelectorAll('[data-countdown]').forEach(el=>{el.replaceChildren(...values.map((n,i)=>{const cell=document.createElement('div');const b=document.createElement('b');b.textContent=String(n).padStart(2,'0');const label=document.createElement('small');label.textContent=['Días','Horas','Minutos','Segundos'][i];cell.append(b,label);return cell;}));});
    const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Guayaquil',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    document.querySelectorAll('[data-countdown-message]').forEach(el=>el.textContent=today==='2026-12-19'?'¡Hoy es el gran día!':diff===0?'Gracias por ser parte de nuestra historia.':'');
  }
  tick();setInterval(tick,1000);
  document.querySelectorAll('[data-copy-account]').forEach(btn=>btn.addEventListener('click',async()=>{const status=document.querySelector('[data-copy-status]');try{await navigator.clipboard.writeText('2214572931');status.textContent='Número de cuenta copiado.';}catch{status.textContent='Selecciona y copia el número: 2214572931';}}));
  const status=document.getElementById('rsvp-status');if(!status)return;
  const buttons=[...document.querySelectorAll('[data-rsvp]')];
  if(Date.now()>new Date(cfg.limite).getTime()){status.textContent='El plazo de confirmación finalizó. Por favor, comunícate con Andrés o Melanie.';return;}
  if(!cfg.rsvpEndpoint)return;
  if(!validGuest){status.textContent='Abre tu enlace personalizado para confirmar tu asistencia.';return;}
  status.textContent='Selecciona tu respuesta para enviarla.';buttons.forEach(b=>b.disabled=false);
  buttons.forEach(btn=>btn.addEventListener('click',async()=>{
    buttons.forEach(b=>b.disabled=true);status.textContent='Enviando tu respuesta…';
    try{
      const result=await new Promise((resolve,reject)=>{
        const cb='boda_'+Date.now()+'_'+Math.random().toString(36).slice(2);const script=document.createElement('script');
        const cleanup=()=>{clearTimeout(timer);script.remove();delete window[cb];};
        const timer=setTimeout(()=>{cleanup();reject(new Error('timeout'));},15000);
        window[cb]=data=>{cleanup();resolve(data);};script.onerror=()=>{cleanup();reject(new Error('network'));};
        const url=new URL(cfg.rsvpEndpoint);url.search=new URLSearchParams({...guest,action:'save',respuesta:btn.dataset.rsvp,callback:cb});script.src=url.href;document.body.append(script);
      });
      if(!result.ok)throw new Error(result.error || 'save');
      status.textContent=btn.dataset.rsvp==='si'?'¡Gracias! Tu asistencia quedó confirmada.':'Gracias por avisarnos. Tu respuesta quedó registrada.';
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
    }catch{status.textContent='No pudimos verificar el guardado. Revisa tu conexión e inténtalo de nuevo; puedes reenviar sin duplicar tu respuesta.';}
    finally{buttons.forEach(b=>b.disabled=false);}
  }));
  if (document.body.classList.contains('reminder')) {
    const gift = document.createElement('section');
    gift.className = 'reminder-gift';
    gift.innerHTML = '<p class="eyebrow">Mesa de regalos</p><p>Tu presencia es nuestro mejor regalo.</p><p>Si deseas obsequiarnos algo:</p><dl><dt>Banco</dt><dd>Pichincha</dd><dt>Cuenta</dt><dd>Ahorros · 2214572931</dd><dt>Titular</dt><dd>Melani Torres</dd><dt>Cédula</dt><dd>0940584212</dd></dl><button type="button" data-copy-account>Copiar número de cuenta</button><p data-copy-status role="status"></p>';
    document.querySelector('.reminder-card')?.append(gift);
    gift.querySelector('[data-copy-account]').addEventListener('click', async () => {
      const status = gift.querySelector('[data-copy-status]');
      try { await navigator.clipboard.writeText('2214572931'); status.textContent = 'Número de cuenta copiado.'; }
      catch { status.textContent = 'Número de cuenta: 2214572931'; }
    });
  }
})();
