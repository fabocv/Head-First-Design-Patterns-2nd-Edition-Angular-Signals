# Capítulo 3: Decorating Objects: the Decorator Pattern

## Decorator Pattern (Estructural)

El Decorator permite agregar responsabilidades a un objeto dinámicamente sin modificar su clase original ni crear una jerarquía enorme de herencias. Se envuelve el objeto en otro que implementa la misma interfaz, y que añade funcionalidad antes o después de delegar la llamada al objeto original.

**✅ Pros**

- Extensión flexible: puedes añadir funcionalidades sin tocar el código base (OCP – Open/Closed Principle).

- Combinación dinámica: puedes apilar varios decoradores en tiempo de ejecución.

- Evita herencias profundas: reemplaza la típica explosión de subclases.

- Reutilización: los decoradores son modulares y se pueden combinar en distintos contextos.

**❌ Contras**

- Complejidad: demasiados decoradores anidados pueden dificultar entender el flujo.

- Depuración más difícil: cuesta seguir qué decorador aplicó qué cambio.

- Posible sobreuso: a veces una simple composición/estrategia basta.

- No asegura orden: si el orden de los decoradores es importante, puedes introducir bugs sutiles.

### Recomendaciones para aplicar el patrón

Contrato claro primero: define la interfaz base antes de añadir decoradores.

Documenta el orden: el orden de decoración suele importar; hazlo explícito.

Evita anidamientos innecesarios: no crees más capas de las que puedas soportar en debugging.

Instrumenta para debugging: logs/trace que indiquen la cadena de decoradores aplicada.

Tests por combinación: unit tests para cada decorador aislado y tests de integración para las combinaciones más probables.

Feature flags y rollout: desplegar decoradores gradualmente ayuda a detectar efectos secundarios.

Fallbacks seguros: si un decorador falla, define degradación (ej. skip logging, fallback a email si SMS falla).

## Ejemplos empresariales

### 1) Seguridad y autenticación — UserService decorado con Logging, Authorization, Caching

****Qué resuelve****: añadir funcionalidades transversales (log, autorización, cache) sin tocar el servicio core de usuarios.

#### Implementación — pasos

- Definir la interfaz base: qué métodos expone UserService (getUser, updateUser, etc.) y contratos (entradas/salidas/errores).

- Diseñar decoradores: especifica responsabilidad de cada decorador (pre-checks, post-logging, cache read/write).

- Decidir orden de envoltura: documenta la secuencia (ej. Authorization -> Caching -> Logging) y por qué.

- Implementar envoltura: cada decorador recibe la instancia subyacente y delega, añadiendo su lógica antes/después.

- Configuración runtime: activar decoradores por tenant/feature flag/env para despliegues progresivos.

- Errores y fallbacks: definir si un decorador debe fallar la operación o degradar (ej. si cache falla, seguir sin cache).

- Observabilidad: instrumentar qué decoradores participaron y métricas añadidas.

- Tests: unit para servicio desnudo y para cada decorador; tests de integración con combinaciones críticas.

#### Cuándo usar / cuándo evitar

- Usar si quieres añadir cross-cutting concerns sin modificar UserService.

- Evitar si la lógica es simple o el overhead de capas complica debugging; si necesitas transacciones estrictas entre pasos, considerar otra estrategia.

### 2) Procesamiento de datos — TransactionService con FraudCheckDecorator, AuditTrailDecorator

**Qué resuelve**: insertar validaciones y auditoría alrededor del procesamiento de transacciones sin alterar el core que persiste/ejecuta la transacción.

#### Implementación — pasos

- Contrato de transacción: define inputs (payload, idempotency key) y outcomes (success/fail, reasons).

- Diseñar decoradores con side-effects controlados: FraudCheck (pre), AuditTrail (post), EnrichData (pre).

- Orden obligatorio: FraudCheck antes de persistir; AuditTrail después de confirmación. Documenta esto.

- Idempotencia/compensaciones: decoradores respetan idempotency keys y no duplican efectos.

- Política de manejo de fraude: decidir rechazo vs encolamiento para revisión manual.

- Testing de escenarios críticos: fraude detectado, retries, y comportamiento en fallos parciales.

- Monitorización y alertas: métricas de rejections, latencias introducidas y volumen de auditoría.

- Privacidad: enmascarar datos sensibles en logs/audits.

#### Cuándo usar / cuándo evitar

- Usar para añadir checks/auditoría sin tocar el core de negocio.

- Evitar si necesitas transaccionalidad atómica entre check y persistencia (aquí la solución suele requerir orquestador o transacción coordinada).

### 3) Notificaciones / Mensajería — Notifier básico decorado con Sms, Push, Slack

**Qué resuelve**: permitir múltiples canales de notificación componibles sin duplicar la lógica de notificación core.

#### Implementación — pasos

- Contrato único de notificación: canonical notify(target, payload) y resultado esperado.

- Core notifier: implementa envío base (por ejemplo email).

- Decoradores por canal: cada decorador añade un canal (SMS, Push, Slack) y delega al core.

- Política de preferencia: usar decoradores condicionales basados en preferencias del usuario o configuración.

- Retries/Backoff: cada decorador define su política; evitar bloquear el core request (usar colas para canales lentos).

- Idempotencia: usar keys para evitar duplicados en reintentos.

- Métricas por canal: éxito, fallos y latencia.

- Tests E2E: flujos multi-canal y simulación de fallos en proveedores.

#### Cuándo usar / cuándo evitar

- Usar cuando múltiples canales se combinan dinámicamente y quieres reusar el core.

- Evitar si la orquestación entre canales requiere transacciones fuertes o ordering estricto.

### 4) Facturación — PriceCalculator decorado con Discount, Tax, Fee

**Qué resuelve**: aplicar múltiples ajustes al precio (descuentos, impuestos, cargos) de forma modulable y auditables.

#### Implementación — pasos

- Definir modelo base: inputs (items, customer, locale), salida (subtotal, impuestos, total).

- Crear decoradores con responsabilidad única: DiscountDecorator, TaxDecorator, FeeDecorator.

- Orden legal y de negocio: documenta si impuesto se calcula sobre subtotal o sobre subtotal menos descuento.

- Versionado de reglas: mantener reglas/versiones para reproducibilidad del cálculo.

- Transparencia: cada decorador debe producir descriptor legible para factura (qué aplicó y por qué).

- Rounding y contabilidad: definir reglas de redondeo coherentes con ERP/contabilidad.

- Tests financieros: escenarios combinados, límites legales y multi-jurisdicción.

- Auditoría: registrar qué decoradores actuaron y sus valores para soporte/regulación.

#### Cuándo usar / cuándo evitar

- Usar cuando las reglas de cálculo son modulares y cambian con frecuencia.

- Evitar si el cálculo es simple y fijo; usar composición excesiva puede complicar conciliación contable.

### 5) UI (Angular/Frontend) — componente base decorado con accesibilidad, tracking, estilos dinámicos

**Qué resuelve**: añadir features UI (a11y, tracking, theming) reutilizables sin reescribir cada componente.

#### Implementación — pasos

- Definir contrato del componente base: inputs/outputs, events y lifecycle claramente documentados.

- Decidir la técnica de “decorator” en frontend: wrapper components, directives, higher-order components, o composition via services.

- **Diseñar decoradores UI**:

- - **AccessibilityDecorator**: añade ARIA, keyboard handlers.

- - **TrackingDecorator**: hook en eventos para enviar métricas.

- - **ThemingDecorator**: aplica clases/variables CSS según config.

- Isolation & non-invasive API: decoradores no deben alterar la API pública del componente, solo extender comportamiento.

- Orden y prioridades: especificar cómo interactúan (ej. theming antes de rendering, tracking conectado a eventos luego de accesibility handlers).

- Lazy-load y performance: cargar tracking libs o skins de manera lazy para no inflar bundles iniciales.

- Testing visual y de accesibilidad: snapshots, tests con axe-core, interacción keyboard.

- Feature flags & rollout: activar decoradores por entorno, roles o A/B testing.

- Observabilidad: métricas de impacto en render y errores introducidos por decoradores.

- Fallbacks: si un decorador falla (tracking), degradar sin romper la UI.

#### Cuándo usar / cuándo evitar

- Usar si quieres aplicar cross-cutting UI concerns en muchos componentes y mantener DRY.

- Evitar si la capa de envoltura añade latencia perceptible o complica la accesibilidad; si solo pocos componentes necesitan la mejora, aplica directamente allí.

> ### 📌 Regla de oro
> Usa Decorator cuando necesites acumular responsabilidades dinámicamente.