# Capítulo 6: Encapsulating Invocation: the Command Pattern

# Patrón Command | Comportamiento

Encapsula una solicitud (acción) en un objeto independiente, permitiendo desacoplar al emisor (quien pide la acción) del receptor (quien la ejecuta).
Esto facilita deshacer/rehacer, colas de comandos, logging de acciones y ejecución diferida.

✅ Pros

- Desacoplamiento: el invocador no necesita saber cómo se ejecuta la acción.

- Historial / undo-redo: permite guardar y revertir acciones fácilmente.

- Composición flexible: comandos pueden combinarse, encolarse o ejecutarse secuencialmente.

- Reutilización: el mismo invocador puede ejecutar distintos comandos.

❌ Contras

- Sobrecarga de clases: muchos comandos → demasiados objetos pequeños.

- Complejidad: puede ser overkill en operaciones simples.

- Gestión de estado: si los comandos son complejos, mantener el contexto correcto se complica.

📌 Cuándo usarlo

- Cuando necesitas undo/redo (editores, transacciones).

- Cuando quieres ejecutar acciones de forma diferida o en cola.

- Cuando los invocadores y receptores deben estar desacoplados.

- Cuando requieres log de operaciones o reejecución programada.

🚫 Cuándo no usarlo

- Cuando las operaciones son triviales y basta con llamar métodos directamente.

- En sistemas pequeños donde la sobrecarga de comandos no compensa.

## Ejemplos empresariales

### 1) Sistemas de facturación — órdenes de pago / facturas

#### Qué resuelve
Permite registrar cada acción sobre una factura (crear, aplicar descuento, anular, emitir) como objetos ejecutables, facilitando trazabilidad, reejecución, auditoría y rollback controlado.

#### Implementación — pasos

- Definir los commands principales (GenerarFactura, AplicarDescuento, CancelarFactura, EmitirPago) y su contrato (ej. execute(), undo() opcional).

- Diseñar el receiver (servicio que realiza las operaciones reales sobre facturas) y el invoker (cola/servicio responsable de ejecutar comandos).

- Decidir persistencia de comandos: almacenar en DB el command + estado (pendiente/ejecutado/failed) para auditoría y reejecución.

- Implementar manejo de errores y políticas de retry/compensación; registrar resultado y razones de fallo.

- Añadir un command log con metadata (who, when, correlationId) para audit trail.

- Proveer mecanismos de undo() o comandos compensatorios (RevertirFactura) para revertir efectos.

- Tests: unidades por command, tests de integración para secuencias y reintentos; pruebas de integridad contable.

#### Cuándo usar / cuándo evitar

- Usar si necesitas historial/auditoría, capacidad de deshacer acciones contables o rehacer eventos fallidos.

- Evitar si el proceso es extremadamente simple y lineal sin necesidad de auditoría o rollback; el overhead administrativo no compensa.

### 2) Edición de documentos corporativos (editor con undo/redo)

#### Qué resuelve
Encapsula acciones de edición (insertar, borrar, formato) para soportar undo/redo, macros, replay y almacenamiento incremental de cambios (operational transforms / CRDTs si es colaborativo).

#### Implementación — pasos

- Definir la interfaz de comando (execute(), undo(), optional mergeWith(other) para optimizaciones).

- Implementar commands básicos (InsertText, DeleteText, ApplyStyle) que actúen sobre el receiver (document model).

- Mantener una pila de historial (undo stack) y pila de redo; almacenar suficiente contexto para undo.

- Si hay edición colaborativa, diseñar estrategia para transformar/combinar comandos (OT/CRDT).

- Persistencia incremental: grabar comandos (no snapshots) para reconstruir estado o para auditoría.

- UI: bind de undo/redo, deshacer por acciones atómicas y agrupación de comandos (batching) para UX.

- Tests: secuencias de comandos (execute → undo → redo), concurrencia en colaboración y performance en historiales largos.

#### Cuándo usar / cuándo evitar

- Usar cuando el producto requiere undo/redo, audit trail de cambios o capacidad de replay (editores, contratos, diseño).

- Evitar si solo necesitas snapshots periódicos o la complejidad de mantener undo supera el beneficio (casos donde guardar versiones completas es suficiente).

### 3) Procesos de RRHH — aprobaciones y acciones sobre solicitudes

#### Qué resuelve
Modela cada decisión (solicitar, aprobar, rechazar, delegar) como comando para auditar quién hizo qué, permitir revocaciones, encolar aprobaciones y orquestar delegaciones/compensaciones.

#### Implementación — pasos

- Listar comandos del flujo (SolicitarVacaciones, AprobarSolicitud, RechazarSolicitud, DelegarAprobador) y contrato (execute/undo/metadata).

- Receiver: servicio de solicitudes que aplica cambios de estado en la entidad (request).

- Persistir comandos y su estado (pendiente, ejecutado, revertido) para trazabilidad y soporte.

- Integrar con workflow/orquestador: encolar comandos para aprobación asincrónica y notificar a quien corresponda.

- Implementar reglas de permisos: validar que el invocador tenga autoridad antes de ejecutar el command.

- Definir comandos compensatorios (ej. RevertirAprobacion) para escenarios de arrepentimiento o error.

- Tests de seguridad (roles), tests de flujo (encolado / reintentos) y de consistencia de estado.

#### Cuándo usar / cuándo evitar

- Usar en flujos con jerarquías, revisiones y donde registrar cada acción es crítico (auditoría laboral, cumplimiento).

- Evitar cuando la interacción es mínima y no requiere deshacer ni historial detallado; un simple cambio de estado podría bastar.

### 4) Automatización en e-commerce — pipelines de pedido (agregar, procesar, cancelar)

#### Qué resuelve
Permite encapsular operaciones del checkout y fulfillment como comandos que se pueden encolar, reintentar, auditar y deshacer (p. ej. cancelar pedido, revertir autorización).

#### Implementación — pasos

- Definir comandos clave (AgregarAlCarrito, ConfirmarPedido, ProcesarPago, EmitirShipment, CancelarPedido) con execute() y, si aplica, undo() o compensate().

- Implementar un invoker que ejecute comandos síncronos o los encole en un broker (para procesamiento asíncrono y retries).

- Persistir estado de cada command para reintentos y reconciliación (idempotency keys).

- Diseñar compensaciones: comandos que revierten efectos externos (reembolsos, cancelar shipment).

- Integrar webhooks/proveedores externos: normalizar respuestas y mapear errores a estados de comando.

- Instrumentación: logs de cada command, métricas de latencia/errores y dashboards de retry/failures.

- Tests E2E con simulación de fallos externos (pagos declined, carriers) y verificación de compensaciones.

#### Cuándo usar / cuándo evitar

- Usar cuando necesitas resiliencia (retries), auditoría y capacidad de compensar efectos externos (pagos, envíos).

- Evitar si todo es estrictamente síncrono y no hay sistemas externos ni necesidad de reintentos ni undo — la complejidad no compensa.

## Recomendaciones finales (cuándo elegir Command y riesgos)

- Elige Command cuando necesites: undo/redo, colas y retries, historial auditado de acciones, o desacoplar invocador y ejecutor (esp. con efectos externos).

- Evítalo cuando las acciones son triviales, la sobrecarga de objetos/persistencia no aporta valor o la latencia/complexidad de encolado complicaría el flujo.

**Riesgos comunes:** proliferación de clases/objetos Command, dificultad para mantener contexto en undo, y complejidad de coordinar compensaciones con sistemas externos.

**Mitigaciones:** agrupar/mergear commands, definir compensate() en vez de undo() cuando sea más realista, usar idempotency keys y persistir metadata suficiente para reconstruir o auditar.


### Resumen

“El patrón Command convierte acciones en objetos: poder para ejecutar, deshacer o encolar. Úsalo cuando el control manda, evítalo cuando la simpleza basta.”