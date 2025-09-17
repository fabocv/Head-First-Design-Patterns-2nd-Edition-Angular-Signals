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

### Ejemplos empresariales

#### Seguridad y autenticación

Un UserService decorado con LoggingDecorator, AuthorizationDecorator, y CachingDecorator según se necesite.

Ejemplo: verificar roles en una app de RRHH sin reescribir toda la lógica de usuario.

#### Procesamiento de datos

Decoradores que transforman o validan datos antes de persistirlos.

Ejemplo: en un sistema financiero, un TransactionService decorado con FraudCheckDecorator y AuditTrailDecorator.

#### Notificaciones / Mensajería

Enviar una notificación base (email) y decorar con SMS, push o Slack.

Ejemplo: CRM que permite sumar canales sin reescribir el core.

#### Facturación

Decoradores que aplican descuentos, impuestos o cargos extra sobre un cálculo de precio base.

Ejemplo: e-commerce con reglas cambiantes de IVA, promociones, comisiones.

#### UI (Angular/Frontend)

Un componente base decorado con mejoras (ejemplo: accesibilidad, tracking, estilos dinámicos).

Ejemplo: en dashboards empresariales, añadir mediciones de telemetría sin reescribir cada componente.

> ### Recuerda:
> Usa Decorator cuando necesites acumular responsabilidades dinámicamente.