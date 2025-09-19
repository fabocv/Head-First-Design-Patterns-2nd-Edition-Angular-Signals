

# Patrón Facade | Estructural

Ofrece una interfaz simple y unificada a un subsistema complejo. La fachada (facade) oculta la complejidad y coordina llamadas a múltiples componentes internos para que el cliente vea una API sencilla.

**✅ Pros**

- Simplicidad para el cliente: reduce el surface area que otros equipos deben aprender.
- Desacoplamiento: clientes dependen de la fachada, no de múltiples clases internas.
- Encapsula complejidad y políticas de orquestación.
- Facilita evolución interna: puedes refactorizar subsistemas sin afectar clientes que usan la fachada.
- Buenas para BFF / anti-corruption layers en integraciones.

**❌ Contras**

- Puede volverse God Object: si la fachada crece y concentra demasiada lógica.
- Oculta poder/funcionalidad fina: clientes pierden acceso a funcionalidades avanzadas del subsistema.
- Otra capa de código que mantener; riesgo de duplicar lógica si no se diseña bien.
- No elimina la complejidad interna, solo la oculta; problemas subyacentes siguen ahí.

📌 Cuándo usarlo

- Cuando quieras simplificar la API que otros módulos usan.
- Para encapsular múltiples integraciones (3rd party APIs) detrás de una sola cara.
- Cuando necesitas BFF / Anti-Corruption Layer entre dominios.
- Para exponer un API estable mientras refactorizas internamente.

**🚫 Cuándo no usarlo**

- Si necesitas acceso directo y frecuente a capacidades detalladas del subsistema.
- Si la fachada solo hace passthrough sin coordinar nada — sobra la capa.
- No usar como excusa para meter lógica de negocio compleja; esa lógica debería vivir en servicios/capas apropiadas.

## Ejemplos empresariales 

### 1) BFF (Backend For Frontend) para un portal de clientes

**Qué resuelve:** Unifica múltiples microservicios (perfil, pedidos, facturación, recomendaciones) y presenta un endpoint simple optimizado para la UI.

#### Implementación — pasos

- Definir contratos de datos necesarios por la UI (payloads y shape).
- Crear la fachada BFF que coordina llamadas a microservicios, agrega/transforma datos y maneja caché/aggregation.
- Implementar resiliencia (timeouts, retries, circuit breakers) en la fachada.
- Capa de seguridad: validar tokens, escopos y sanitizar respuestas.
- Tests E2E con la UI: validar formatos y tiempos.
- Monitoreo: latencia por endpoint y éxito de agregaciones.

#### Cuándo usar / cuándo evitar
- Usar cuando múltiples servicios deben combinarse para un flujo UI y quieres optimizar payload/latencia.
- Evitar si la UI sólo necesita datos de un servicio o si agregas demasiada lógica de negocio en el BFF.

#### Recomendaciones

- Mantén la fachada delgada: solo orquestación y composición; evita lógica de negocio compleja.
- Versiona la API del BFF y documenta shapes para frontend.

### 2) Facade para integración con múltiples proveedores de pago

**Qué resuelve:** Oculta las diferencias entre Stripe, PayPal, MercadoPago, presentando una API única (charge, refund, webhookHandler).

#### Implementación — pasos

- Definir interfaz común de pagos (authorize, capture, refund, webhookValidate).
- Implementar adaptadores/clients para cada proveedor.
- Crear la fachada que selecciona adaptador por config/tenant y normaliza respuestas/errores.
- Manejar idempotency, logs y reconciliación en la fachada.
- Tests con sandboxes y simuladores de fallo.
- Monitoreo y alertas por tasa de error por proveedor.

#### Cuándo usar / cuándo evitar
- Usar si se integra con varios proveedores y quieres centralizar la lógica de selección y normalización.
- Evitar si la integración es con un único proveedor y no hay planes de expansión.

#### Recomendaciones

- La fachada debe exponer errores normalizados y códigos de negocio, no los detalles raw del proveedor.
- Mantén adaptadores separados y registrados dinámicamente para facilitar añadir nuevos proveedores.

### 3) Facade de orquestación para generación de reportes

**Qué resuelve:** Coordina extracción de datos, renderizado (PDF/Excel/HTML), watermarking y almacenamiento en S3, exponiendo un generateReport(params) simple.

#### Implementación — pasos

- Mapear pipeline de generación (fetch → transform → render → store).
- Implementar servicios individuales y un facade que orquesta el flujo y maneja retries/queues.
- Soportar generación síncrona corta y asíncrona (job queue) para heavy reports.
- Exponer endpoint único que devuelve estado/URL (o stream si es inmediato).
- Tests de performance y validación de output.
- Logs y trazabilidad por request id.

#### Cuándo usar / cuándo evitar

- Usar cuando la generación implica varios pasos y sistemas externos y quieres una API unificada.
- Evitar para reports triviales que no necesitan orquestación ni persistencia.

#### Recomendaciones

- Implementa colas para reports pesados y haz que la fachada devuelva un job id.
- Mantén trazabilidad clara para reproducir/reportar fallos.

### 4) Facade como Anti-Corruption Layer entre sistemas legados y nuevo dominio

**Qué resuelve:** Traduce y adapta modelos/contratos entre un sistema legacy (ERP) y tus microservicios modernos, evitando contaminar el dominio nuevo con malas prácticas del legacy.

#### Implementación — pasos

- Identificar discrepancias de modelo, unidades, reglas de negocio y edge-cases del legacy.
- Diseñar adaptadores que transformen requests/responses entre mundos.
- Implementar la fachada que expone la API limpia del nuevo dominio y usa adaptadores internamente.
- Añadir validaciones y saneamiento (data massaging) en la fachada.
- Tests de migración y casos de datos sucios.
- Monitorizar diferencias y métricas de mapping/errores.

#### Cuándo usar / cuándo evitar

- Usar cuando integras con sistemas que tienen modelos conflictivos y quieres proteger tu dominio.
- Evitar si ambos sistemas comparten el mismo modelo y no hay deuda técnica que esconder.

#### Recomendaciones

- Encapsula toda la lógica de mapping en la fachada/adapter; nunca pierdas el control del modelo del nuevo dominio.
- Documenta transformaciones para auditoría.

### 5) Facade para subsistema de autenticación y autorización

**Qué resuelve:** Unifica llamadas a Cognito/Keycloak/LDAP/IDP internas y a policy engines (OPA), exponiendo métodos simples login, validateToken, getEffectivePermissions.

#### Implementación — pasos

- Definir contrato público (login, refresh, introspect, logout, permissions).
- Implementar adaptadores a IdPs y a la capa de políticas.
- Crear la fachada que centraliza token validation, caching de metadata JWKS y resolución de permisos (merge de groups/roles).
- Añadir caching, rate-limits y protección frente a ataques (brute force).
- Tests de seguridad con tokens válos/inválidos y expirados.
- Monitoreo de autenticaciones fallidas y latencia de introspect.

#### Cuándo usar / cuándo evitar

- Usar cuando tienes múltiples IdPs o necesitas una API consistente para toda la plataforma.
- Evitar si tu sistema usa un único IdP y no requiere normalización.

#### Recomendaciones

- No implementes autorización sensible sólo en la fachada cliente; la fachada debe ayudar a la UI y BFF, pero la autorización final la aplica el backend/servicio de recursos.
- Mantén JWKS/config reload automático y manejo seguro de secretos.

### Recomendaciones transversales al usar Facade

> - Diseña la fachada para casos de uso concretos, no como “todo en uno”.
> - Mantén la facade delgada: coordinación y simplificación, no lógica de negocio compleja.
> - Si la fachada crece mucho, re-particiona en fachadas más pequeñas por dominio/ámbito.
> - Documenta claramente qué hace la fachada y qué API interna todavía existe (para uso avanzado).
> - Versiona la fachada para evitar romper consumidores al evolucionar.