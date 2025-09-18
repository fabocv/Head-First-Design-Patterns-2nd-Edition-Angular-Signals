# Capítulo 8 Encapsulating Algorithms: the Template Method Pattern

# Template Method Pattern | Estructural

#### Resumen

El patrón Template Method define la estructura general (esqueleto) de un algoritmo en una clase base y delega pasos específicos a las subclases. Esto asegura consistencia en el flujo, pero permite variar detalles.

### Pros ✅

- Reutilización de lógica común sin duplicación.
- Facilita mantener estándares de proceso.
- Hace explícito el “flujo” de un algoritmo.
- Permite extender variaciones fácilmente.

### Contras ❌

- Acopla subclases a la clase base (puede rigidizar jerarquía).
- Difícil de usar cuando hay demasiadas variantes (puede llevar a herencia excesiva).
- No favorece la composición tanto como Strategy o Decorator.

<hr>

## Ejemplos empresariales

### 1. Procesamiento de pagos multicanal

**Qué resuelve:** distintos proveedores (Stripe, PayPal, MercadoPago) siguen un flujo común: validar → autorizar → ejecutar → confirmar.
#### Implementación-pasos:

- Clase abstracta PaymentProcessor define el processPayment() con pasos estándar.

- Cada subclase (StripeProcessor, PayPalProcessor…) implementa detalles de autorización/ejecución.
#### Cuándo usar / cuándo evitar:

- Usar cuando el flujo es fijo y común, con variaciones en pasos internos.

- Evitar si cada proveedor tiene un proceso radicalmente distinto.
> Recomendación: ideal para fintechs que necesitan mantener consistencia en auditoría.

### 2. Generación de reportes corporativos

**Qué resuelve:** reportes tienen estructura común (extraer datos → procesar → renderizar), pero difiere el formato de salida (PDF, Excel, HTML).
#### Implementación-pasos:

- Clase base ReportGenerator con método generate().
- Subclases implementan render().
#### Cuándo usar / cuándo evitar:

- Usar si todos los reportes siguen la misma pipeline.
- Evitar si algunos reportes requieren flujos adicionales o condicionales.

> Recomendación: estándar en BI y ERP.

### 3. Workflows de Recursos Humanos

**Qué resuelve:** procesos de contratación, onboarding y offboarding tienen pasos comunes: registrar, verificar, aprobar, notificar.
#### Implementación-pasos:

- Clase EmployeeWorkflow define plantilla con executeWorkflow().
- Subclases (Onboarding, Offboarding) personalizan notificaciones y verificaciones.

#### Cuándo usar / cuándo evitar:

- Usar si la organización quiere asegurar consistencia de procesos.
- Evitar si cada flujo es único y cambia drásticamente.

> Recomendación: útil en corporativos con compliance fuerte.

#### 4. Procesamiento de datos ETL

**Qué resuelve:** todos los pipelines siguen pasos ETL (Extract → Transform → Load), pero difiere cómo se implementa cada paso.

#### Implementación-pasos:

- Clase abstracta ETLProcess con runPipeline().
- Subclases implementan extract() (API, DB), transform() (reglas de negocio), load() (destino: warehouse, lake).
#### Cuándo usar / cuándo evitar:

- Usar si el ciclo ETL es fijo.
- Evitar si los pipelines son muy dinámicos o compuestos.

> Recomendación: muy práctico en empresas de datos/analytics.

### 5. Frontends (Angular/UX) – Flujo de formularios dinámicos

**Qué resuelve:** formularios comparten estructura (renderizar campos → validar → enviar → feedback), pero difiere la validación o envío.
#### Implementación-pasos:

- Clase base FormHandler con método processForm().
- Subclases (LoginForm, SurveyForm, PaymentForm) implementan validaciones/envíos específicos.

#### Cuándo usar / cuándo evitar:

- Usar cuando quieres consistencia en UI/UX.
- Evitar si cada formulario es demasiado distinto en estructura.

> Recomendación: excelente para dashboards empresariales con múltiples formularios.