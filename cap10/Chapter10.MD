# Capítulo 10 The State of Things: the State Pattern

# Patrón State | Comportamiento

Permite que un objeto cambie su comportamiento cuando cambia su estado interno, como si cambiara de clase. Se evita el uso excesivo de condicionales if/else o switch y se encapsula cada estado en su propia clase.

### ✅ Pros

- Limpia el código al eliminar grandes bloques condicionales.
- Hace explícita la lógica de estados → más fácil de mantener y extender.
- Favorece la abierta/cerrada (OCP): agregar un nuevo estado no rompe los existentes.
- Encapsula reglas de transición dentro de los estados.

### ❌ Contras

- Puede aumentar el número de clases (cada estado = una clase nueva).
- Si el sistema no tiene alta variabilidad de estados, puede ser innecesariamente complejo.
- El orden o flujo de transición puede quedar demasiado fragmentado si no se documenta bien.

## Ejemplos Empresariales
### 1. Pedido en un sistema de delivery

> Mira el código acá: [cap10.ts](cap10.ts)

**Qué resuelve:** manejar estados de un pedido (Pendiente, Preparando, En camino, Entregado).

**Implementación**: cada estado define el comportamiento del pedido: notificaciones, cancelaciones, cambios de dirección.

#### Cuándo usar / evitar:

Usar: cuando los pedidos cambian mucho de estado y cada estado tiene reglas distintas.

Evitar: si solo hay un par de estados simples con reglas mínimas.

**Recomendación**: ideal para apps tipo Rappi, UberEats, donde la lógica de flujo es crítica.

### 2. Cuenta bancaria (Ahorro / Corriente / En descubierto)

**Qué resuelve:** reglas distintas según el estado financiero del cliente.

**Implementación**:

- CuentaNormal permite depósitos y retiros.
- Sobregiro limita retiros y aplica comisiones.
- Congelada bloquea toda transacción.

#### Cuándo usar / evitar:

Usar: cuando los productos bancarios cambian dinámicamente.

Evitar: si todos los clientes tienen reglas uniformes.

**Recomendación**: útil para escalabilidad de productos financieros.

### 3. Documento en un flujo de aprobación empresarial

**Qué resuelve:** documentos pasan por estados (Borrador, En revisión, Aprobado, Rechazado).

**Implementación**: cada estado define qué operaciones son válidas (ej: editar, enviar a revisión, aprobar).

#### Cuándo usar / evitar:

Usar: en empresas con compliance y auditoría estricta.

Evitar: en flujos triviales (ej: un simple “pendiente / aprobado”).

**Recomendación**: perfecto en ERP o software de RRHH.

### 4. Máquina expendedora de bebidas

**Qué resuelve:** controlar comportamiento según estado de la máquina (Sin moneda, Con moneda, Dispensando, Agotado).

**Implementación**: cada estado determina qué pasa al presionar botones o insertar dinero.

#### Cuándo usar / evitar:

Usar: cuando hay varias interacciones secuenciales posibles.

Evitar: si la máquina es muy básica (solo un botón).

**Recomendación**: bueno para retail automatizado.

### 5. Suscripción SaaS (Free, Trial, Premium, Cancelada)

**Qué resuelve:** controlar acceso a features según el plan.

**Implementación**:

- FreeState: acceso básico.
- TrialState: funciones avanzadas limitadas en tiempo.
- PremiumState: acceso total.
- CanceledState: acceso restringido.

#### Cuándo usar / evitar:

Usar: si los planes cambian mucho y hay lógica diferenciada.

Evitar: si solo cambia un flag booleano (activo/inactivo).

**Recomendación**: muy útil para productos escalables tipo Spotify, Netflix.

## Frase resumen

El patrón State es como un "cerebro adaptable" que permite que un objeto se transforme de acuerdo a su situación actual, eliminando condicionales gigantes y dándole flexibilidad empresarial, pero solo es recomendable cuando los estados son variados, con reglas claras y cambiantes.