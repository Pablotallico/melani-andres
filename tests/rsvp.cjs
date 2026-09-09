const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const rosterContext={window:{}};vm.runInNewContext(fs.readFileSync('assets/invitados-data.js','utf8'),rosterContext);
const guests=rosterContext.window.INVITADOS;assert.equal(guests.length,40);assert.equal(guests.reduce((s,g)=>s+g.cupos,0),86);
let now='2026-09-09T12:00:00Z';const rows=[];
const sheet={getLastRow:()=>rows.length,appendRow:r=>rows.push(r),getDataRange:()=>({getValues:()=>rows}),getRange:n=>({getValues:()=>[rows[n-1]],setValues:r=>rows[n-1]=r[0]})};
const server={Date:class extends Date{constructor(...a){super(...(a.length?a:[now]));}},SpreadsheetApp:{openById:id=>{assert.equal(id,'1ly6gk_DQbv-kQyGhEtMktRyUnshnympA9hF7U_lhUtw');return {getSheetByName:()=>sheet};},flush:()=>{}},LockService:{getScriptLock:()=>({waitLock:()=>{},releaseLock:()=>{}})}};
vm.createContext(server);vm.runInContext(fs.readFileSync('google-apps-script-rsvp.js','utf8'),server);
assert.equal(server.listResponses_().responses.length,0);
assert(server.saveResponse({action:'save',id:'ma-001',respuesta:'si',cupos:999,nombre:'Alterado'}).ok);
assert.equal(rows[1][1],'Luis Martinez');assert.equal(rows[1][3],2);
assert(server.saveResponse({action:'save',id:'ma-001',respuesta:'no'}).ok);assert.equal(rows.length,2);
assert.equal(server.listResponses_().responses[0].respuesta,'no');assert.equal(server.listResponses_().responses[0].nombre,undefined);
assert.equal(server.saveResponse({action:'save',id:'inventado',respuesta:'si'}).ok,false);
now='2026-10-02T05:00:00Z';assert.equal(server.saveResponse({action:'save',id:'ma-001',respuesta:'si'}).ok,false);
console.log('OK: 40 invitados/86 cupos, guardado, actualización, padrón fiable, lectura y fecha límite.');
class Element{constructor(){this.children=[];this.value='';this.textContent='';this.handlers={};}append(...c){this.children.push(...c);}replaceChildren(...c){this.children=c;}addEventListener(e,f){this.handlers[e]=f;}remove(){}click(){return this.handlers.click?.();}}
async function panel(mode){
 const els=new Map(),get=s=>{if(!els.has(s))els.set(s,new Element());return els.get(s);};
 const win={INVITADOS:guests,BODA:{baseUrl:'https://pablotallico.github.io/melani-andres/',rsvpEndpoint:'https://example.test/exec'}};
 let payload={ok:true,responses:[]};let interval;
 const body=new Element();body.dataset={mode};body.append=s=>{const cb=new URL(s.src).searchParams.get('callback');queueMicrotask(()=>payload===null?s.onerror():win[cb](payload));};
 const ctx={window:win,document:{body,hidden:false,querySelector:get,createElement:()=>new Element(),addEventListener:()=>{}},location:{href:'http://localhost/invitados.html'},URL,URLSearchParams,Blob,navigator:{},setTimeout,clearTimeout,setInterval:f=>interval=f};
 vm.runInNewContext(fs.readFileSync('assets/panel.js','utf8'),ctx);await new Promise(setImmediate);
 assert.equal(get('#stat-pending').textContent,40);assert.equal(get('#stat-si').textContent,0);assert.equal(get('#rows').children.length,40);
 const anchor=get('#rows').children[0].children[4].children[0];assert(anchor.href.includes(mode==='recordatorio'?'recordatorio.html':'index.html'));assert(anchor.href.includes('id=ma-'));
 payload={ok:true,responses:[{id:'ma-001',respuesta:'si'},{id:'ma-004',respuesta:'si'},{id:'ma-002',respuesta:'no'}]};await get('#refresh').click();
 assert.equal(get('#stat-si').textContent,2);assert.equal(get('#stat-seats-si').textContent,6);assert.equal(get('#stat-no').textContent,1);assert.equal(get('#stat-pending').textContent,37);
 get('#response-filter').value='si';get('#response-filter').handlers.change();assert.equal(get('#rows').children.length,2);
 payload=null;await get('#refresh').click();assert.equal(get('#stat-si').textContent,2);assert(get('[data-notice]').textContent.includes('últimos datos'));
 assert.equal(typeof interval,'function');
}
(async()=>{await panel('invitacion');await panel('recordatorio');console.log('OK: ambos paneles, filtros, enlaces, contadores y conservación de datos ante error.');})().catch(e=>{console.error(e);process.exitCode=1;});


