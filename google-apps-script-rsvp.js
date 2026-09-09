const SPREADSHEET_ID = '1ly6gk_DQbv-kQyGhEtMktRyUnshnympA9hF7U_lhUtw';
const DEADLINE = '2026-10-01T23:59:59-05:00';
const GUESTS = [{"id":"ma-040","titulo":"Sra.","nombre":"Daniela Alban","cupos":2,"grupo":"Amigos novia","tipo":"acompañante"},{"id":"ma-014","titulo":"Sra.","nombre":"Geomara Gonzales","cupos":1,"grupo":"Amigos novia","tipo":"solo"},{"id":"ma-011","titulo":"Sra.","nombre":"Melani Lucas","cupos":2,"grupo":"Amigos novia","tipo":"acompañante"},{"id":"ma-013","titulo":"Sra.","nombre":"Nicole Ramirez","cupos":2,"grupo":"Amigos novia","tipo":"acompañante"},{"id":"ma-022","titulo":"Sra.","nombre":"Adriana Valencia","cupos":1,"grupo":"Amigos novio","tipo":"solo"},{"id":"ma-035","titulo":"Sr.","nombre":"Angel David Serrano","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-020","titulo":"Sr.","nombre":"Cao Muñoz","cupos":1,"grupo":"Amigos novio","tipo":"solo"},{"id":"ma-016","titulo":"Sr.","nombre":"Daniel Valdovinos","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-034","titulo":"Sr.","nombre":"David Serrano","cupos":3,"grupo":"Amigos novio","tipo":"familia"},{"id":"ma-038","titulo":"Sr.","nombre":"Eddy Moreno","cupos":2,"grupo":"Amigos novio","tipo":"esposa"},{"id":"ma-019","titulo":"Sr.","nombre":"Enoc Franco","cupos":1,"grupo":"Amigos novio","tipo":"solo"},{"id":"ma-017","titulo":"Sr.","nombre":"Erick Valencia","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-028","titulo":"Sr.","nombre":"Ezequiel Lopez","cupos":1,"grupo":"Amigos novio","tipo":"solo"},{"id":"ma-039","titulo":"Sr.","nombre":"Fidel Morales","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-018","titulo":"Sr.","nombre":"Issac Muñoz","cupos":1,"grupo":"Amigos novio","tipo":"solo"},{"id":"ma-030","titulo":"Sr.","nombre":"Jimmy Garcia","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-029","titulo":"Sr.","nombre":"Jonathan Cedeño","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-027","titulo":"Sr.","nombre":"Jose Chamorro","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-037","titulo":"Sr.","nombre":"Manuel Peñafiel","cupos":2,"grupo":"Amigos novio","tipo":"esposa"},{"id":"ma-023","titulo":"Sr.","nombre":"Mateo Herrera","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-033","titulo":"Sr.","nombre":"Pablo Narvaez","cupos":2,"grupo":"Amigos novio","tipo":"acompañante"},{"id":"ma-032","titulo":"Sr.","nombre":"Santo Mosquera","cupos":1,"grupo":"Amigos novio","tipo":"solo"},{"id":"ma-009","titulo":"Sr.","nombre":"Agusto Juanazo","cupos":2,"grupo":"Familia novia","tipo":"esposa"},{"id":"ma-012","titulo":"Sr.","nombre":"Alberto Juanazo","cupos":1,"grupo":"Familia novia","tipo":"solo"},{"id":"ma-015","titulo":"Sra.","nombre":"Diana Juanazo","cupos":1,"grupo":"Familia novia","tipo":"solo"},{"id":"ma-007","titulo":"Sr.","nombre":"Felix Rosales","cupos":3,"grupo":"Familia novia","tipo":"familia"},{"id":"ma-002","titulo":"Sra.","nombre":"Guisella Juanazo","cupos":1,"grupo":"Familia novia","tipo":"solo"},{"id":"ma-008","titulo":"Sr.","nombre":"Jonathan Cantos","cupos":4,"grupo":"Familia novia","tipo":"familia"},{"id":"ma-003","titulo":"Sr.","nombre":"Omar Torres","cupos":2,"grupo":"Familia novia","tipo":"acompañante"},{"id":"ma-005","titulo":"Sr.","nombre":"Peter Arroyo","cupos":5,"grupo":"Familia novia","tipo":"familia"},{"id":"ma-006","titulo":"Sr.","nombre":"Ruben Maya","cupos":4,"grupo":"Familia novia","tipo":"familia"},{"id":"ma-010","titulo":"Sr.","nombre":"Steven Torres","cupos":3,"grupo":"Familia novia","tipo":"familia"},{"id":"ma-004","titulo":"Sr.","nombre":"Winton Juanazo","cupos":4,"grupo":"Familia novia","tipo":"familia"},{"id":"ma-024","titulo":"Sr.","nombre":"Fidel Martinez","cupos":4,"grupo":"Familia novio","tipo":"familia"},{"id":"ma-025","titulo":"Sr.","nombre":"Fidel Tenorio","cupos":4,"grupo":"Familia novio","tipo":"familia"},{"id":"ma-036","titulo":"Sr.","nombre":"Janio Tenorio","cupos":2,"grupo":"Familia novio","tipo":"esposa"},{"id":"ma-031","titulo":"Sr.","nombre":"Jonathan Mosquera","cupos":2,"grupo":"Familia novio","tipo":"acompañante"},{"id":"ma-001","titulo":"Sr.","nombre":"Luis Martinez","cupos":2,"grupo":"Familia novio","tipo":"esposa"},{"id":"ma-021","titulo":"Sra.","nombre":"Luisa Tenorio","cupos":2,"grupo":"Familia novio","tipo":"acompañante"},{"id":"ma-026","titulo":"Sr.","nombre":"Wilian Tenorio","cupos":2,"grupo":"Familia novio","tipo":"esposa"}];
const HEADERS = ['id','nombre','titulo','cupos','tipo','respuesta','fecha'];
function doGet(e) {
 const p=e&&e.parameter||{},cb=p.callback||'';
 if(cb&&!/^boda_[a-zA-Z0-9_]+$/.test(cb))return output_({ok:false,error:'Callback no válido'});
 try {return output_(p.action==='save'?saveResponse(p):(!p.action||p.action==='list')?listResponses_():{ok:false,error:'Acción no válida'},cb);}
 catch(error){return output_({ok:false,error:'No se pudo acceder a la hoja. Intenta de nuevo.'},cb);}
}
function output_(data,cb){return ContentService.createTextOutput(cb?cb+'('+JSON.stringify(data)+');':JSON.stringify(data)).setMimeType(cb?ContentService.MimeType.JAVASCRIPT:ContentService.MimeType.JSON);}
function sheet_(){
 const ss=SpreadsheetApp.openById(SPREADSHEET_ID);let sheet=ss.getSheetByName('Respuestas');
 if(!sheet)sheet=ss.insertSheet('Respuestas');
 if(sheet.getLastRow()===0)sheet.appendRow(HEADERS);
 const headers=sheet.getRange(1,1,1,HEADERS.length).getValues()[0];
 if(HEADERS.some((h,i)=>h!==headers[i]))throw new Error('Encabezados incompatibles');
 return sheet;
}
function listResponses_(){
 const lock=LockService.getScriptLock();lock.waitLock(10000);
 try{
 const known=new Set(GUESTS.map(g=>g.id));
 return {ok:true,responses:sheet_().getDataRange().getValues().slice(1).filter(r=>known.has(String(r[0]))&&['si','no'].includes(r[5])).map(r=>({id:String(r[0]),respuesta:r[5],fecha:r[6]}))};
 }finally{lock.releaseLock();}
}
function saveResponse(p){
 const guest=GUESTS.find(g=>g.id===p.id);
 if(p.action!=='save'||!guest||!['si','no'].includes(p.respuesta))return {ok:false,error:'Invitación o respuesta no válida'};
 if(new Date()>new Date(DEADLINE))return {ok:false,error:'El plazo de confirmación finalizó'};
 const lock=LockService.getScriptLock();lock.waitLock(10000);
 try{
 const sheet=sheet_(),values=sheet.getDataRange().getValues();
 const existing=values.findIndex((r,i)=>i>0&&String(r[0])===guest.id);
 const safe=v=>/^[=+@-]/.test(String(v))?"'"+v:String(v);
 const row=[guest.id,safe(guest.nombre),safe(guest.titulo),guest.cupos,safe(guest.tipo),p.respuesta,new Date().toISOString()];
 if(existing>0)sheet.getRange(existing+1,1,1,row.length).setValues([row]);else sheet.appendRow(row);
 SpreadsheetApp.flush();return {ok:true,id:guest.id,respuesta:p.respuesta};
 }finally{lock.releaseLock();}
}

