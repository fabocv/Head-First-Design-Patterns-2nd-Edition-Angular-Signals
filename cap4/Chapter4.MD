# Capítulo 4:  Baking with OO Goodness: the Factory Pattern

# Factory Pattern | Creacional

Idea central:
El Factory abstrae la creación de objetos, delegando la responsabilidad a un método o clase especial. Así, el código cliente no necesita conocer los detalles de construcción ni las clases concretas, solo la interfaz común.

✅ Pros

- Encapsula la creación: el cliente no depende de constructores concretos.

- Menos acoplamiento: puedes cambiar la clase concreta sin modificar el resto del sistema.

- Reutilización de lógica de instanciación: centralizas validaciones, configuración inicial o caching.

- Escalabilidad: facilita agregar nuevas variantes sin romper el código cliente.

❌ Contras

- Complejidad extra: añade una capa más de abstracción (puede ser overkill en sistemas simples).

- Difícil rastrear instancias: a veces cuesta seguir qué clase concreta devolvió la fábrica.

- Abuso común: usar factories innecesariamente puede ensuciar el diseño.


## Recomendaciones transversales

### Usar Decorator cuando

- Necesitas añadir responsabilidades dinámicamente a objetos/servicios sin modificar su código.

- Quiere evitar explosión de subclases (combinaciones de comportamientos).

- Buscas composición modular y reutilizable de comportamientos.

### Evitar Decorator cuando

- El orden de aplicación es crítico y complejo (puede introducir bugs sutiles).

- La funcionalidad podría resolverse con una simple composición de funciones o configuración (overengineering).

- Necesitas transaccionalidad atómica entre pasos; decorator por sí solo no garantiza consistencia.

### Riesgos y mitigaciones

- Debugging: instrumenta la cadena de decoradores (trace ids, logs).

- Anidamiento excesivo: limita combinaciones habituales; documenta patrones soportados.

- Fugas de rendimiento: mide latencia añadida y lazy-load donde convenga.

- Incompatibilidades: estandariza inputs/outputs para evitar que decoradores se “pisen”.

## Ejemplos empresariales

#### 1) Autenticación / Seguridad — AuthFactory (JWT | OAuth | SAML)

- Requisitos y alcance: define qué flujos necesitas (login, refresh, logout, introspect, revocation) y qué responsabilidades tendrá el factory vs el backend.

- Contrato (interface): escribe la API común que deben exponer las implementaciones (p. ej. authenticate(), validateToken(), getUserClaims(), refresh()).

- Mapa de proveedores: enumera proveedores soportados (Cognito, AzureAD, Keycloak, SAML provider X). Documenta diferencias (claims, lifetime, scopes).

- Implementaciones concretas: por cada proveedor, define la clase que implementa el contrato, encapsulando detalles (endpoints, JWKS, scopes).

- Selección de implementación: define la lógica para elegir la impl — por configuración (env var), por tenant (multitenancy), o por discovery dinámico (metadata URL).

- Configuración y secretos: centraliza client IDs, secretos, endpoints en un store seguro (vault/secret manager). No incluyas secretos en config en claro.

- Fallback y errores: define comportamiento cuando la elección falla (fallback a provider por defecto, mensajes claros, logging).

- Integración backend/frontend: decide qué validaciones se realizan en backend y cuáles en frontend; el factory suele usarse server-side o en un service de BFF.

- Tests & mocks: crea tests unitarios para cada strategy y tests de integración con entornos sandbox de los IdP (o mocks con JWKS).

- Observabilidad: métricas de latencia/errores por provider, y logging de auditoría (intentos de login, revocations).

- Documentación y on-boarding: explica cómo añadir un nuevo provider (qué archivos/metadata se necesita).

#### 2) Conexión a bases de datos — ConnectionFactory (Postgres | MongoDB | DynamoDB)

- Definir contrato de acceso: qué operaciones mínimas debe soportar la conexión (pooling, getConnection, close, healthCheck).

- Inventario de DBs: lista de motores y requisitos (drivers, connection string, pooling, transacciones).

- Configuración multi-tenant: decide si la fábrica recibe un tenant-key y mapea a una DB distinta por tenant/config.

- Implementaciones concretas: encapsula lógica específica: pool config, timeouts, retry policy, transacciones.

- Pooling y lifecycle: centraliza el pool en la instancia factory y previene creación excesiva de conexiones.

- Selector dinámico: regla de selección por env/tenant/feature flag; soporte para cambiar en runtime si es necesario.

- Health checks y fallback: implementa checks periódicos y estrategia de fallback (read-replica, cache, degraded mode).

- Seguridad: manejo seguro de credenciales y rotación. Usa IAM roles si aplica (RDS, Dynamo).

- Métricas y tracing: instrumenta latencia, pool usage, errores y queries lentas.

- Testing: mocks de drivers, pruebas de integración con contenedores (testcontainers) y pruebas de failover.

- Documentación operativa: cómo escalar pools, qué tunables ajustar en picos, y runbook para DB failover.

#### 3) Procesadores de pago — PaymentFactory (Stripe | PayPal | MercadoPago)

- Requisitos legales y de negocio: flow de pagos (one-time, suscripción, reembolsos), compliance PCI, monedas soportadas.

- Contrato de alto nivel: métodos esenciales (charge, authorize, refund, webhookHandler, getTransactionStatus).

- Implementaciones por provider: encapsula endpoints, webhooks, idempotency keys, y diferencias de modelos (tokens, customers).

- Configuración y seguridad: almacena claves en vault; gestiona entornos (sandbox vs production).

- Manejo de webhooks: cada provider firma webhooks distinto → las impl deben validar y normalizar eventos.

- Idempotencia y retries: estandariza comportamiento (reintentos, idempotency keys) para evitar cargos dobles.

- Selector de provider: por país, preferencia del usuario, costo de transacción, o fallback si un provider falla.

- Reconciliación y reporting: logs y export para reconciliación contable; mapea códigos de errores del provider a tu dominio.

- Tests end-to-end: usa entornos sandbox y simuladores de fallos (declined card, network errors).

- Observabilidad y alerting: métricas de éxito/fracaso, latencia y alertas de volumen anómalo.

- Política de rollback y contabilidad: define cómo manejar reembolsos, contracargos y disputas.

#### 4) Gestión de documentos — ReportFactory (PDF | Excel | HTML)

- Requisitos de output: formatos, plantillas, internacionalización, accesibilidad, watermarking, y tamaños de archivo máximos.

- Contrato de generación: métodos (render(data): Buffer | Stream, preview, paginate, attachWatermark).

- Implementaciones concretas: librerías/servicios para PDF (wkhtmltopdf, Puppeteer), Excel (xlsx), HTML templating.

- Plantillas y assets: centraliza templates, fuentes, estilos y recursos (logos) en un repo/versionado.

- Selector de formato: regla por petición de usuario, configuración por cliente o por tipo de reporte.

- Streaming y performance: soporta streams para archivos grandes, generación asíncrona y cola (background jobs).

- Caché y pre-generación: cachea reports para consultas repetidas; invalida caché por cambios en datos.

- Seguridad y privacidad: enmascarado de datos sensibles, control de acceso a reports pre-generados.

- Testing visual: tests que comparen snapshots visuales y validen estructura (headers, columnas).

- Entrega y almacenamiento: decide S3/Blob y firma URLs para descarga segura.

- Auditoría y trazabilidad: log de quién generó qué y cuándo (necesario en entornos regulatorios).

#### 5) Frontends (Angular/UX) — WidgetFactory (componentes dinámicos)

- Requisitos UX: inventario de widgets, props esperadas, responsabilidad (render-only vs widgets con lógica).

- Contrato/Descriptor: define el descriptor que identifica un widget (tipo, versión, config schema).

- Implementaciones (registry): cada widget implementa la interfaz/component API esperada; register them in a registry.

- Selector y orquestación: regla que mapea rol/feature flag/config del tenant a una lista de widgets.

- Carga dinámica: decide si usar lazy-loading (dynamic imports / module federation) para optimizar bundle size.

- Config-driven: widgets deben aceptar config serializable (JSON) para personalización sin deploy.

- Seguridad y sandboxing: evita ejecutar lógica no confiable; restringe data-binding a props permitidas.

- Testing de integración: snapshot tests y pruebas visuales; tests de compatibilidad entre versiones de widget.

- Observabilidad UX: métricas de uso por widget, errores y rendimiento de render.

- Versionado y backward-compat: strategy para desplegar nuevas versiones sin romper consumidores.

- Documentación runtime: editor/configurator para product owners que armen dashboards con widgets.

>### 📌 Regla de oro
>
> Usa Factory cuando quieras desacoplar el qué del cómo.
El cliente pide un objeto, pero no sabe ni le importa de qué clase concreta viene.