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

### Ejemplos empresariales

#### Autenticación / Seguridad

Una AuthFactory que devuelve un JwtAuth, OAuthAuth, o SAMLAuth según configuración.

Útil en empresas que integran con múltiples proveedores de identidad (ej. AWS Cognito, Azure AD).

#### Conexión a bases de datos

Una ConnectionFactory que retorna el conector correcto (Postgres, MongoDB, DynamoDB).

Útil en SaaS multicliente con distintos motores de datos.

#### Procesadores de pago

PaymentFactory que instancia StripeProcessor, PayPalProcessor o MercadoPagoProcessor.

En e-commerce o fintech, se elige dinámicamente el proveedor.

#### Gestión de documentos

ReportFactory que genera PDF, Excel o HTML según el formato requerido.

En entornos corporativos donde cada cliente pide un output distinto.

#### Frontends (Angular/UX)

Una WidgetFactory que construye componentes UI dinámicamente según configuración o rol de usuario.

Útil en dashboards personalizados en tiempo de ejecución.

>### 📌 Regla de oro
>
> Usa Factory cuando quieras desacoplar el qué del cómo.
El cliente pide un objeto, pero no sabe ni le importa de qué clase concreta viene.