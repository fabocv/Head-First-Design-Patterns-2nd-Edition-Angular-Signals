# Patrón Adapter | Estructural

El Adapter es un patrón estructural que permite que dos interfaces incompatibles trabajen juntas sin modificar su código original. Actúa como un “traductor” entre un cliente y una clase/servicio externo.

### ✅ Pros

- Facilita la integración con sistemas legados.
- Permite reutilizar código existente sin modificarlo.
- Favorece la desacoplación entre cliente y proveedor de servicio.
- Hace más flexible la arquitectura.

### ❌ Contras

- Puede introducir complejidad innecesaria si no se justifica.
- Puede generar una cascada de adaptadores si hay muchos sistemas distintos.
- Encapsular demasiado puede ocultar fallas del servicio original.

### 📌 Cuándo usarlo

- Cuando quieras integrar librerías externas o sistemas viejos que no puedes modificar.
- Cuando necesites que tu código hable el mismo idioma que APIs con interfaces diferentes.

### 🚫 Cuándo NO usarlo

- Si puedes modificar directamente el código del sistema para alinearlo.
- Si la adaptación introduce más complejidad que valor.
- Si la incompatibilidad es mínima y basta con una función utilitaria en vez de todo un adapter.

## Ejemplos empresariales del Adapter

### 1. Integración de sistemas de pago

**Qué resuelve:** Conectar un sistema de e-commerce con múltiples pasarelas (Stripe, PayPal, MercadoPago) que tienen distintas APIs.

#### Implementación

- Crear una interfaz PaymentProcessor.
- Implementar un Adapter por cada pasarela (StripeAdapter, PayPalAdapter).
- El cliente llama siempre a PaymentProcessor.processPayment().

#### Cuándo usar / cuándo evitar:
- Usar cuando manejas más de un proveedor; evitar si solo tendrás uno fijo.

> **Recomendación:** Úsalo para flexibilidad futura y evitar dependencias rígidas.

### 2. Migración de sistemas ERP

**Qué resuelve:** Hacer que un nuevo módulo ERP se comunique con datos de un ERP antiguo sin reescribir todo.

#### Implementación

- Definir interfaz ERPDataSource.
- Construir LegacyERPAdapter que traduce datos antiguos al formato actual.
- Conectar ambos al pipeline de negocio.

#### Cuándo usar / cuándo evitar:
Usar en procesos largos de migración; evitar cuando el sistema viejo ya no se usará más.

> **Recomendación**: Ideal para migraciones graduales.

### 3. Analítica de datos y BI

**Qué resuelve:** Unificar fuentes de datos (SQL, NoSQL, APIs externas) hacia un mismo dashboard.

#### Implementación

- Definir AnalyticsSource.
- Implementar adaptadores (SQLAdapter, MongoAdapter, APIAdapter).
- El dashboard consume solo AnalyticsSource.

#### Cuándo usar / cuándo evitar:
- Usar cuando los datos provienen de fuentes heterogéneas; evitar si todos ya están normalizados.

> **Recomendación:** Muy útil en empresas multi-fuente de datos.

### 4. Conectores de IoT en logística

**Qué resuelve:** Integrar sensores de diferentes fabricantes en una misma plataforma.

#### Implementación

- Definir SensorReader.
- Crear adaptadores para cada protocolo (MQTTAdapter, ZigBeeAdapter).
- La plataforma logística consume solo SensorReader.

#### Cuándo usar / cuándo evitar:
- Usar cuando el parque de dispositivos es variado; evitar si el hardware ya soporta un estándar.

> **Recomendación:** Bueno para normalizar entornos caóticos de IoT.

### 5. Interoperabilidad en banca

**Qué resuelve:** Permitir que un banco con core legacy pueda integrarse con APIs modernas (Open Banking).

#### Implementación

- Definir BankAPI.
- Crear adaptadores que transformen SOAP/XML a JSON/REST.
- Los clientes fintech usan siempre BankAPI.

#### Cuándo usar / cuándo evitar:
- Usar en bancos que no pueden cambiar rápido; evitar si ya existe un estándar adoptado.

> **Recomendación:** Útil en entornos regulados donde no puedes reescribir el core.

## Resumen

El Adapter es el traductor silencioso de la arquitectura: útil para integrar sistemas diversos sin reescribirlos, pero debe aplicarse con criterio para no añadir capas innecesarias.