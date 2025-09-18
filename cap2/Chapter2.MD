## Capítulo 2: Keeping your Objects in the Know: the Observer Patterns

# Patrón Observer | Comportamiento

**Propósito:** define una relación uno a muchos entre objetos. Cuando un objeto (“sujeto”) cambia de estado, notifica automáticamente a sus “observadores”.

**Idea clave:** desacoplar el emisor de eventos (subject) de los receptores (observers).

### Usos típicos:

Sistemas de eventos (UI, Angular signals, RxJS observables).

Comunicación entre componentes sin acoplarlos directamente.

Modelar flujos reactivos o pub-sub.

### ✅ Pros

- Desacoplamiento fuerte → el subject no necesita saber quién lo escucha.

- Escalabilidad → puedes agregar o quitar observadores sin tocar el subject.

- Extensibilidad → permite crear sistemas reactivos y plugin-based.

- Natural para GUIs y flujos asíncronos → base de eventos en Angular, React, etc.

### ❌ Contras

- Orden de notificación no garantizado → los observers se notifican, pero no hay control fuerte sobre el orden ni sobre fallos de uno afectando a otros.

- Difícil de depurar → las cadenas de eventos pueden generar efectos secundarios no obvios (¿quién me notificó?).

- Posible sobrecarga de eventos → muchos observadores = mucho overhead, incluso si no hacen nada útil.

- Fugas de memoria → si un observer no se desuscribe, puede quedar en memoria (clásico bug en Angular/RxJS).

- Complejidad accidental → para escenarios simples, un callback directo es más claro que un sistema Observer formal.


## Ejemplos empresariales del Observer

#### Sistema de notificaciones internas

Un servicio central emite eventos (p. ej. user.created, order.shipped) y múltiples consumidores reaccionan: email, Slack, registro en DB.

#### Actualización de cachés distribuidas

Cuando un recurso cambia (ej. producto actualizado), el subject notifica para invalidar/actualizar caches en servicios y CDNs.

#### Monitoreo / Telemetría en tiempo real

Un componente emite métricas y errores; varios observadores consumen para dashboards, alertas y almacenamiento histórico.

#### Workflows y orquestación de procesos

Un motor de workflow emite etapas (task.completed, approval.granted) y distintos microservicios reaccionan (siguiente tarea, notificar, auditar).

## Cómo usar el patrón Observer para cada ejemplo (pasos prácticos)

### 1) Sistema de notificaciones internas (event bus para eventos del negocio)

**Qué resuelve**: un servicio publica eventos (p. ej. user.created, order.shipped) y múltiples consumidores reaccionan: email, Slack, tareas asíncronas, logs.

#### Implementación — pasos

- Definir el catálogo de eventos: lista de eventos con esquema mínimo (type, timestamp, payload, correlationId).

- Implementar el Subject (publisher): componente que emite eventos. Puede ser una librería interna o un endpoint que publica al bus.

- Elegir transporte: local in-memory (app monolito) o broker (Kafka, SNS, Rabbit) según escala y durabilidad.

- Implementar observers: EmailService, SlackNotifier, ActivityLogger, AnalyticsPublisher que suscriben y procesan eventos.

- Registro dinámico: permitir registrar/desregistrar observers por config/feature flags.

- Manejo de fallos: observers deben procesar con retries y DLQ sin bloquear al publisher.

- Tracing: propagar correlationId para seguir la cadena entre servicios.

- Pruebas: unit tests del publisher y mocks para cada observer; integración con broker en staging.

#### Cuándo usar / cuándo evitar

- Usar si hay múltiples reacciones independientes a los mismos hechos del negocio y quieres bajo acoplamiento.

- Evitar si hay sólo un consumidor o si necesitas transacciones estrictas (el patrón no garantiza transaccionalidad entre subject y observers).

### 2) Actualización de cachés distribuidas (invalidate/update caches)

**Qué resuelve:** cuando se actualiza una entidad, notificar a cachés locales, Redis y CDNs para invalidar o refrescar.

#### Implementación — pasos

- Definir qué cambios disparan eventos: create/update/delete y qué keys/patterns afectan.

- Emitir evento desde la fuente de verdad: al persistir, publicar entity.updated { entityId, version, keys }.

- Transport layer: usar pub/sub o broker para garantizar entrega a instancias distribuidas.

- Observers de cache: workers que invalidan keys en caches locales, en Redis y solicitan purge a CDN.

- Versioning/optimistic checks: incluir version para evitar stale invalidations (race conditions).

- Retries y monitorización: reintentos y métricas de latencia/invalidation success.

- Pruebas de consistencia: verificar que tras evento los hits/misses cambian como esperado.

### Cuándo usar / cuándo evitar

- Usar cuando tu arquitectura es distribuida y necesitas propagar invalidaciones sin acoplar servicios.

- Evitar si la consistencia debe ser fuerte y síncrona (en ese caso, lock / transacción con cache-coherent strategy es preferible).

### 3) Monitoreo/telemetría en tiempo real (producers → collectors)

**Qué resuelve:** emisores ligeros (apps) publican métricas/errores; múltiples consumidores procesan: Prometheus, ELK, alerting, BI.

#### Implementación — pasos

- Catalogar métricas y eventos: tipos (counter, gauge, trace, error), etiquetas estándar (service, env, host).

- Subject ligero en apps: librería no bloqueante que publica eventos/metrics (UDP, agent, HTTP batch).

- Observers especializados: MetricsCollector, LogForwarder, AlertEngine que consumen y persisten/alertan.

- Batching y sampling: agrupar o muestrear para reducir load en collectors.

- QoS y backpressure: degradación (más sampling) si collectors se saturan.

- Enriquecimiento central: subject agrega contexto (correlationId, version) para todos los observers.

- Tests y SLAs: pruebas de volumen y reglas de alerta.

#### Cuándo usar / cuándo evitar

- Usar si necesitas observabilidad modular y escalable con múltiples sinks.

- Evitar si solo necesitas logs simples locales; el overhead no compensa en apps pequeñas.

### 4) Orquestación coreográfica de workflows (etapas → acciones independientes)

**Qué resuelve:** motor emite etapas del proceso (task.completed, approval.granted) y microservicios reaccionan para avanzar, auditar o compensar.

#### Implementación — pasos

- Modelar eventos de workflow: definir payloads (workflowId, step, status, context).

- Emitir eventos desde el motor: cada cambio de estado publica el evento.

- Observers de acción: microservicios que encolan la siguiente tarea, envían notificaciones o registran auditoría.

- Idempotencia en observers: diseñar observers para tolerar reentregas (idempotency keys).

- Versionado de eventos: soportar cambios futuros en pasos/estructura del payload.

- Circuit breakers & compensations: observers deben poder disparar compensaciones si falla un paso crítico.

- Simulación y tests de resiliencia: pruebas de reentrega, latencia y fallos parciales.

#### Cuándo usar / cuándo evitar

- Usar para coreografía distribuida donde queremos añadir pasos sin cambiar el coordinador central.

- Evitar si el flujo requiere un control secuencial estricto y transaccional (entonces orquestador central es mejor).

## Recomendaciones generales — cuándo elegir Observer y riesgos

**Elegir Observer cuando:** varios consumidores independientes deben reaccionar a los mismos eventos y quieres bajo acoplamiento y facilidad para extender funcionalidad.

**No elegir cuando**: necesitas transacciones ACID entre emisor y receptor, orden estricto de ejecución o sólo hay un consumidor.

**Riesgos comunes:**

- Debugging complejo: instrumenta con correlationId y trazabilidad.

- Fugas de memoria: en procesos in-memory, asegurar unsubscribe en lifecycle.

- Inconsistencias por reentregas: diseñar idempotencia y versioning.

- Saturación: usar batching, sampling y backpressure.

**Mitigaciones:** usar brokers (durabilidad), establecer SLA de eventual consistency, instrumentación y DLQ/retries, y pruebas de caos.


>### 📌 Regla de oro
>
>Úsalo cuando varios objetos dependan de otro, y no quieras acoplarlos.
>
>Evítalo cuando haya solo un consumidor, o cuando el ciclo de vida de los observers sea difícil de controlar.
>
>En Angular → prefiere signals y RxJS bien gestionados con takeUntil o async pipe para evitar fugas.
