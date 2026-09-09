# Activar confirmaciones de Andrés & Melanie

Lista importada: 40 invitaciones, 86 cupos. Para aceptar las pruebas, actualizar la implementación de Apps Script con el padrón local actualizado. Fuente: `excel/melani-andres.xlsx`, hoja `Control Invitados`, filas 12–51. Se conservan los nombres tal como están escritos; se omiten acompañantes, mesas y notas.

1. Abrir la hoja de Google proporcionada, con la cuenta propietaria: https://docs.google.com/spreadsheets/d/1ly6gk_DQbv-kQyGhEtMktRyUnshnympA9hF7U_lhUtw/edit
2. Ir a **Extensiones → Apps Script**. Pegar el contenido completo de `google-apps-script-rsvp.js` en un proyecto nuevo vinculado a esta hoja y guardar.
3. Elegir **Implementar → Nueva implementación → Aplicación web**. Ejecutar como tu cuenta y permitir el acceso a **Cualquier usuario**. Completar la autorización de Google.
4. Copiar la URL que termina en `/exec` y colocarla en `rsvpEndpoint` de `assets/config.js` (o enviarla a Codex para completar la conexión). El enlace de Google Sheets NO sustituye la URL de implementación.
5. Abrir `/exec?action=list`: debe devolver `ok: true`. La pestaña `Respuestas` se crea automáticamente sin alterar otras pestañas.
6. Publicar los archivos del sitio actualizados. Abrir una invitación personalizada de prueba y comprobar la fila correspondiente en Sheets y su estado en `invitados.html`.

Ambos paneles actualizan cada 30 segundos mientras están visibles, al regresar a la pestaña y al pulsar **Actualizar respuestas**. Los totales incluyen toda la lista; los filtros afectan solamente a las filas visibles. Una confirmación positiva cuenta todos los cupos asignados a esa invitación. No se pregunta por asistencia parcial.

Sin conexión se muestra **Sin sincronizar**; no equivale a **Pendiente**. Una vez recibida una lectura correcta, ausencia de respuesta significa pendiente. Si falla una actualización se conserva el último resultado y se informa del error.

El servicio acepta solamente los IDs del padrón y obtiene nombre y cupos de su propia lista; los datos editados en un enlace no modifican los cupos guardados. Los enlaces identifican invitaciones, no autentican personas. La lectura devuelve ID, estado y fecha para el panel; no devuelve nombres ni datos bancarios.

Fecha límite mantenida: **1 de octubre de 2026, 23:59:59 (Ecuador)**. Las respuestas continúan siendo consultables después de esa fecha.

Para futuras modificaciones de invitados, mantener los mismos IDs y actualizar tanto `assets/invitados-data.js` como el padrón `GUESTS` del Apps Script. Después actualizar la implementación. No hay importación continua desde Excel.

El Excel fuente no necesita publicarse en GitHub. No subir archivos temporales que comienzan por `~$`.

