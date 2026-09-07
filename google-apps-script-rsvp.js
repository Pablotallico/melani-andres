// Pegar en Extensiones > Apps Script de una hoja NUEVA para Melani y Andrés.
// No devuelve la lista de respuestas públicamente. Consultarla dentro de Google Sheets.
function doGet(e) {
  var p = (e && e.parameter) || {};
  var callback = p.callback || '';
  if (!/^boda_[a-zA-Z0-9_]+$/.test(callback)) return ContentService.createTextOutput(JSON.stringify({ok:false,error:'Solicitud no válida'})).setMimeType(ContentService.MimeType.JSON);
  var payload;
  try { payload = saveResponse(p); } catch (error) { payload = {ok:false,error:'No se pudo guardar la respuesta'}; }
  return ContentService.createTextOutput(callback+'('+JSON.stringify(payload)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function saveResponse(p) {
  if(p.action !== 'save' || !/^[a-zA-Z0-9_-]{1,80}$/.test(p.id || '') || !String(p.nombre || '').trim() || String(p.nombre).length > 150 || ['si','no'].indexOf(p.respuesta) < 0 || !Number.isInteger(Number(p.cupos)) || Number(p.cupos) < 1 || Number(p.cupos) > 30) return {ok:false,error:'Datos no válidos'};
  if(new Date() > new Date('2026-10-01T23:59:59-05:00')) return {ok:false,error:'El plazo de confirmación finalizó'};
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    var ss=SpreadsheetApp.getActiveSpreadsheet();var sheet=ss.getSheetByName('Respuestas') || ss.insertSheet('Respuestas');
    if(sheet.getLastRow()===0)sheet.appendRow(['id','nombre','titulo','cupos','tipo','respuesta','fecha']);
    var values=sheet.getDataRange().getValues();var found=values.findIndex(function(row,index){return index>0 && String(row[0])===p.id;});
    var safe=function(value){var s=String(value || '').slice(0,150);return /^[=+@-]/.test(s)?"'"+s:s;};
    var row=[p.id,safe(p.nombre),safe(p.titulo),Number(p.cupos),safe(p.tipo),p.respuesta,new Date().toISOString()];
    if(found>0)sheet.getRange(found+1,1,1,row.length).setValues([row]);else sheet.appendRow(row);
    SpreadsheetApp.flush();return {ok:true};
  } finally {lock.releaseLock();}
}
