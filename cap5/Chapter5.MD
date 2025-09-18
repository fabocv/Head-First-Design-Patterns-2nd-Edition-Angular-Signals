# Capítulo 5: One-of-a-Kind Objects: the Singleton Pattern

# Singleton Pattern | Creacional

El Singleton asegura que exista una única instancia de una clase en toda la aplicación y proporciona un punto global de acceso a ella.

✅ Pros

- Control único de recursos compartidos (DB, logger, cache).

- Menos memoria: no se crean múltiples instancias innecesarias.

- Fácil acceso: cualquier parte del sistema puede usarlo sin pasarlo como dependencia.

- Consistencia global: todos usan el mismo estado.

❌ Contras

- Acoplamiento oculto: partes del código dependen del mismo estado global.

- Difícil de testear: los tests pueden contaminarse si la instancia mantiene estado.

- Violación de SRP: a veces combina demasiadas responsabilidades.

- Riesgo de abuso: se usa como “atajo” en lugar de aplicar inyección de dependencias.

## Ejemplos empresariales 

1) Gestor de configuración central (ConfigManager)

**Qué resuelve**: un único punto que carga y expone la configuración de la app (endpoints, flags, timeouts), evitando lecturas/valores inconsistentes repartidos.

#### Implementación — pasos

- Alcance y lectura inicial: decidir qué se carga al inicio (env vars, vault, archivos, remote config).

- Crear la clase singleton: instancia única que carga la config al boot y la expone como read-only o con métodos controlados de actualización.

- Fuente segura de secretos: integrar vault/secret-manager para credenciales; no almacenar en texto plano.

- Reload/refresh: diseñar cómo y cuándo se actualiza la config (hot-reload, polling, webhook de actualización).

- API de acceso: exponer getters con validación y valores default; evitar setters globales que rompan inmutabilidad inesperada.

- Fallbacks y defaults: si falla la carga remota, usar defaults predefinidos y modo degradado.

- Tests: unit tests para carga inicial y escenarios de refresh; tests de integración con mock de vault.

- Observabilidad: logs en la carga/refresco y métricas de fallos de carga.

- Documentación: cómo añadir nuevas claves, y runbook si la config falla en producción.

#### Cuándo usar / cuándo evitar

- Usar si necesitas una única fuente de verdad de configuración en toda la app.

- Evitar si cada tenant necesita su propia config aislada (mejor un registry por tenant) o si tu app es trivial y la complejidad no compensa.

### 2) Logger centralizado (AppLogger)

**Qué resuelve**: un logger consistente con formato, destinos (fichero, remote, monitoring) y políticas de rotación que todas las piezas del sistema usan.

#### Implementación — pasos

- Definir contract: niveles (error, warn, info, debug), formato (JSON), fields mínimos (timestamp, service, correlationId).

- Crear instancia singleton: instancia global que inicializa transportes (file, stdout, external collector).

- Configuración de sinks: elegir destinos y samplers (env: dev->console, prod->remote).

- Context propagation: API para inyectar contexto (requestId, userId) sin mutar global state.

- Log rotation y retention: política de rotación y borrado; integrar con storage/archiving.

- Performance: non-blocking I/O, buffering y backpressure; sampling para high-volume logs.

- Tests: asegurar formato, niveles y transporte; tests de fallos en sink (degradación).

- Seguridad: sanitizar PII en logs y políticas de access control sobre logs sensibles.

- Observabilidad: métricas de logs emitidos por nivel y errores en envío.

#### Cuándo usar / cuándo evitar

- Usar cuando necesitas coherencia en logging y facilidad para instrumentar toda la plataforma.

- Evitar si cada módulo requiere loggers radicalmente distintos y la opción centralizada se vuelve restrictiva — entonces permitir configuración por módulo.

### 3) Pool de conexiones a base de datos (DBConnectionPool)

**Qué resuelve**: administrar un único pool central para evitar creación descontrolada de conexiones y optimizar recursos.

#### Implementación — pasos

- Definir contract del pool: acquire, release, healthCheck, tamaño máximo y timeouts.

- Instancia singleton: centraliza la creación y gestión del pool al iniciar la aplicación.

- Configuración tunable: max connections, idle timeout, retry policy por env.

- Manejo de fallos: circuit breaker / reconnect logic y fallback (modo degradado read-only).

- Instrumentación: métricas de uso del pool (active, idle, waits) y alertas de agotamiento.

- Close-on-shutdown: liberar conexiones al apagar la app de forma ordenada.

- Tests: tests de concurrency, saturación y timeouts usando entornos aislados.

- Seguridad: credenciales rotadas y uso de roles/identidades cuando aplica.

#### Cuándo usar / cuándo evitar

- Usar cuando múltiples módulos comparten la misma DB y necesitas control central de conexiones.

- Evitar si cada componente conecta a DBs completamente diferentes y no hay beneficio de compartir pool; en microservicios, preferir pool por servicio.

### 4) Servicio de cache en memoria (CacheService)

**Qué resuelve**: proveer un cache compartido en proceso para datos frecuentemente leídos (config, lookups), evitando duplicar estado y cache inconsistentes.

#### Implementación — pasos

- Definir políticas: TTL, eviction strategy (LRU), tamaño máximo en memoria.

- Instancia singleton: única cache en proceso expuesta vía API (get, set, delete, has).

- Backplane (opcional): si hay múltiples instancias, integrar pub/sub para invalidaciones (coherencia).

- Observabilidad: métricas (hits, misses, evictions) y logs de comportamiento.

- Persistencia opcional: backing store (Redis) si la cache debe sobrevivir reinicios.

- Seguridad: cuidado con PII y enmascaramiento en logs; control de quién puede poblar la cache.

- Tests: behaviour under load, eviction correctness, and invalidation propagation.

- Shutdown behavior: flush opcional o persistencia según necesidad.

#### Cuándo usar / cuándo evitar

- Usar para mejorar latencia de lectura de datos que son costosos de calcular o fetch.

- Evitar como única fuente de verdad en entornos distribuidos sin backplane; no confíes en cache singleton para persistencia crítica.

### 5) Gestor de sesiones activas (SessionManager)

**Qué resuelve**: llevar registro central de sesiones activas, tokens revocados, o límites de sesión por usuario.

#### Implementación — pasos

- Definir modelo de sesión: campos necesarios (sessionId, userId, lastSeen, metadata).

- Singleton manager: instancia que registra sesiones en memoria o via backing store.

- Integración con auth: API para crear/validate/destroy session y revocar tokens.

- Escalabilidad: si hay múltiples instancias, almacenar en store central (Redis) y usar singleton como facade local + cache.

- Políticas: expirations, concurrent session limits, forced logout.

- Security: revocations, refresh token handling, and detection of suspicious activity.

- Observabilidad & audit: logs de creación/destrucción y métricas de sesiones activas.

- Tests: concurrency, revocation, and failover behaviour.

#### Cuándo usar / cuándo evitar

- Usar si necesitas un control central de sesiones (single sign-out, limits, revocations).

- Evitar si la app es serverless y las sesiones se delegan totalmente a JWT stateless sin revocation (en ese caso un store central puede ser mejor que singleton en proceso).

## Recomendaciones transversales — cuándo usar Singleton y riesgos

### Usar Singleton cuando

- Hay un recurso único y compartido que realmente debe existir una sola vez por proceso (config loader, pool, logger).

- Necesitas control central de inicialización y lifecycle del recurso.

### Evitar Singleton cuando

- El patrón se usa como atajo para estado global que debería inyectarse (inversión de control / DI).

 - Quieres testabilidad aislada (mocks y resets son más difíciles con singletons globales).

- En arquitecturas distribuidas se confía en singletons in-memory como fuente única (no escala ni es duradero).

### Riesgos y mitigaciones

- Acoplamiento implícito: documenta el uso y prefiere inyección donde sea posible.

- Test pollution: proporcionar métodos de reset o usar factories en tests para aislar instancias.

- Concurrencia: asegurar thread/process safety en creación y acceso si aplica (locks, atomics).

- Estado mutable global: minimizar mutabilidad; preferir readonly o operaciones controladas.

- Escalabilidad: si necesitas coherencia entre procesos, añade backing stores o patterns distribuidos (leader election, distributed lock).

> ### 📌 Regla de oro:
>
>El Singleton no es un martillo para todo. Úsalo solo cuando exista un recurso único y centralizado en la empresa (config, cache, logger, pool de conexiones).