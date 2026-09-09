# Andrés & Melanie · 19 de diciembre de 2026

Actualización RSVP (9 de septiembre): se importaron 40 invitaciones y 86 cupos desde Excel. Ambos paneles muestran estados y totales, y consultan respuestas cada 30 segundos. Sigue `CONEXION-RSVP.md` para activar la nueva implementación; sustituye las instrucciones anteriores que indicaban que las respuestas solo podían consultarse en Sheets. La URL `/exec` ya está configurada. El padrón local incluye además prueba 1 y prueba 2: total 42 invitaciones y 88 cupos. Actualizar la implementación existente de Apps Script con el código local para habilitar estos dos registros.

Sitio estático, sin instalación ni compilación, preparado para GitHub Pages.

## Las cuatro páginas

- `index.html`: invitación principal.
- `invitados.html`: panel de invitados y enlaces de invitación.
- `recordatorio.html`: recordatorio con los detalles del evento.
- `recordatorio-invitados.html`: panel de enlaces de recordatorio.

Los estilos y el comportamiento se comparten en `assets/`. No renombrar `index.html`: GitHub Pages lo usa como inicio.

## Agregar invitados

Editar únicamente `assets/invitados-data.js`. Ambos paneles leen esa lista. Comienza vacía, sin invitados ficticios. Ejemplo:

```js
window.INVITADOS = [
  { id: 'ma-001', titulo: 'Sra.', nombre: 'Nombre Apellido', grupo: 'Familia', cupos: 2, tipo: 'acompañante' }
];
```

Asignar un ID único y permanente por invitación. No reciclar IDs. Los grupos se generan automáticamente; los nombres se ordenan alfabéticamente. Ambos paneles permiten buscar, filtrar, abrir, copiar enlaces/mensajes y exportar los registros visibles en CSV. Los nombres, cupos y tipos viajan en cada enlace: si cambian, reenviar el enlace actualizado.

## Publicar en GitHub

1. Subir TODO el contenido de esta carpeta a la raíz del repositorio elegido.
2. En Settings > Pages, publicar desde la rama que contenga los archivos y la carpeta raíz.
3. Copiar la dirección publicada en `baseUrl` dentro de `assets/config.js`. También puede quedar vacía: al abrir los paneles desde el sitio publicado se calcula automáticamente.
4. Abrir `invitados.html` o `recordatorio-invitados.html` para copiar enlaces.

Los paneles abiertos desde archivos locales o localhost permiten previsualizar, pero bloquean copiar y exportar enlaces mientras no se configure una URL pública. La lista incluida en un sitio estático es pública; `noindex` no proporciona protección de acceso. Si se requiere una lista privada, mantener los paneles y los datos fuera del sitio publicado y usarlos localmente con `baseUrl` configurada.

## Conectar confirmaciones

1. Crear una hoja de Google Sheets nueva para esta boda.
2. Abrir Extensiones > Apps Script y pegar `google-apps-script-rsvp.js`.
3. Implementar como aplicación web, ejecutar como propietario y permitir acceso a cualquier usuario.
4. Pegar su URL terminada en `/exec` en `rsvpEndpoint` de `assets/config.js` y actualizar el sitio.
5. Probar con un enlace personalizado antes de compartirlo. Verificar en la pestaña `Respuestas` de Google Sheets que se guardó el ID, nombre, cupos y respuesta.
6. Si se cambia el código del servidor, actualizar la implementación de Apps Script.

Hasta conectar el servicio, los botones explican que las confirmaciones estarán disponibles próximamente y permanecen desactivados. No se guardan confirmaciones locales ni se muestra éxito antes del acuse del servidor. Reenviar una respuesta actualiza la fila del mismo ID; un bloqueo evita duplicados por concurrencia. Las respuestas se consultan en Sheets: no hay un endpoint público para listar datos. Este sistema identifica por enlace, no autentica al invitado; quien tenga un enlace puede responder por él y sus parámetros pueden editarse. Validación estricta contra un padrón o acceso privado requiere una integración adicional cuando exista la lista.

La fecha límite se aplica tanto en la página como en Apps Script: 1 de octubre de 2026, 23:59:59, Ecuador. Si se cambia, actualizar ambos archivos.

## Pendientes antes de compartir

- Agregar la lista real de invitados.
- Conectar y probar el Apps Script de esta boda; no se reutiliza el de Daniela y Pablo.
- Pegar el enlace exacto de Quinta La Corteza en `mapaUrl`. Actualmente abre una búsqueda por el nombre proporcionado, no una ubicación verificada.
- Confirmar que se desea mantener la fecha límite del 1 de octubre de 2026.

La boda inicia a las 15h00 (UTC−05:00). Google Calendar reserva una hora para el inicio; Apple Calendar crea un evento de inicio sin una hora final inventada. El programa completo se incluye en la descripción de ambos. No se han agregado fotografías de otras parejas ni música ajena; esta versión se apoya en tipografía y composición. Las fuentes usan Google Fonts, con alternativas locales si no hay conexión.

