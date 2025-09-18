# Capítulo 1: Welcome to Design Patterns: intro to Design Patterns

## Introducción

Los autores inician el viaje de aprendizaje mencionando los principios de programación orientada a objetos. Señalan que la idea de este libro es reusar experiencias aprendidas de los patrones en vez de reusar código de manera mecánicamente.


> ## Primer Principio de diseño:

> Dado un problema donde no se quiere implementar interfaces inútiles en un modelo porque ciertas variaciones tienen características que otras no, se sugiere separar lo que cambia (comportamiento) de lo que permanece estable, identificando los aspectos comunes del problema y encapsulando las variaciones como implementaciones específicas. Esto define al **patrón Strategy.**

# Patrón Strategy | Comportamiento

**Propósito**: encapsular comportamientos que cambian para permitir intercambiarlos, sin modificar las clases que los usan.

**Clave**: definir una interface para el comportamiento, y luego múltiples implementaciones que pueden sustituirse en tiempo de ejecución. (*Ver modificación de patos con cohetes al final de esta sección.*)

**Beneficios**:

- Evitar las herencias profundas.

- Aislar lo que varía de lo que permanece estable.

- Facilitar la extensión: agregar un nuevo comportamiento no rompe el código existente.

**Ejemplo (Patos)**: algunos vuelan y otros no; unos hacen quack y otros no. Usar solo herencia complica el modelo, porque los comportamientos varían.

> **Solución**: definir un contrato con interfaces, que representan unidades de información y acción.

Una interface es una unidad de información que establece un comportamiento genérico, además de ser un supertipo: variables que son definidas como interfaces.

### Patos, patos y más patos!
Podemos crear dos interfaces: FlyBehavior (que contiene fly() ), QuackBehavior (quack() ).

Una clase como VuelanConAlas que implemente FlyBehavior tendrá una función fly() distanta a otra clase como NoVuelan (fly no hace nada.).

Similar a Volar, Graznar implementa QuackBehavior, haciendo algún tipo de quack(); luego la clase SinGraznido, su metodo quack no hará nada.

La interfaz FlyBehavior puede ser reusada no solo en patos, sino en otros diversas clases que definan aves o animales.

Considerando que las interfaces son supertipos, pueden definir los tipos de mis clases y variables.


## ⚠️ Contras del Strategy

- Mayor complejidad inicial

- Pasas de tener una clase simple con métodos directos → a múltiples clases + interfaces.

- Para proyectos pequeños, puede ser overengineering.

 -  Proliferación de clases

- Cada comportamiento nuevo = una clase nueva.

> Si no tienes un criterio claro, terminas con docenas de clases para comportamientos mínimos → difícil de mantener.

### Gestión de dependencias

Debes inyectar o pasar estrategias al objeto que las usa.

Si no se gestiona bien (ej. con DI en Angular o contenedores IoC), el código cliente se llena de new.

### Dificultad para seguimiento

Al abstraer el comportamiento, a veces cuesta rastrear “qué implementación se está usando” en runtime.

Esto puede volver debugging más lento.

## Recomendaciones transversales (cuándo usar Strategy / cuándo evitarlo)

### Usa Strategy cuando

- Tienes una operación estable (el qué) y múltiples formas plausibles de realizarla (el cómo).

- Necesitas intercambiar algoritmos en runtime (feature flags, A/B, tenant config).

- Quieres aislar comportamientos variables para pruebas unitarias y extensión sin tocar el core.

### Evítalo cuando

- El número de variantes es 1 (overengineering).

- Las variantes comparten mucho estado y la solución práctica es una sola clase con parámetros.

- La elección del algoritmo requiere conocimiento global o transaccional difícil de encapsular (a veces Chain of Responsibility u orquestador central es mejor).

### Puntos de cuidado

- Gestiona la proliferación de clases: documenta y registra strategies en una factory/registry.

- Centraliza selección (factory/selector) y evita if/else dispersos en el código.

- Considera composición cuando quieras combinar estrategias (no solo elegir una).

- Monitorea qué strategy es usada en producción (observabilidad) para facilitar debugging y tuning.

## Ejemplos empresariales donde se podría aplicar el patrón

### 1) Medios de pago (Payment strategies)

**Qué resuelve:** el checkout debe ejecutar procesarPago() pero el flujo difiere por proveedor: Stripe, PayPal, MercadoPago, etc.

#### Pasos de implementación

- Definir el contrato: interfaz PaymentStrategy con métodos claros (authorize, capture, refund, handleWebhook).

- Implementar cada proveedor como clase que cumple la interfaz (StripeStrategy, PayPalStrategy, ...). Encapsular detalles: endpoints, idempotency, manejo de webhooks.

- Crear una PaymentFactory o selector que elija la estrategia por país, preferencia usuario o configuración del merchant.

- Inyectar la estrategia en el servicio de checkout (DI/BFF). No instanciar new directo en lógica de negocio.

- Manejar errores y políticas comunes (retries, idempotency keys) en una capa base o helper compartido.

- Tests: unit para cada estrategia y e2e con sandboxes de proveedores.

- Observabilidad: logs por provider y métricas de éxito/fracaso.

#### Cuándo usar / no usar

- Usar cuando soportas >1 proveedor o la lógica de pago cambia según regla de negocio (país, moneda, costo).

- No usar si solo hay un proveedor y no hay previsión de cambio — sería overhead.

### 2) Cálculo de precios / descuentos

**Qué resuelve**: aplicar distintos algoritmos para calcular el precio final: descuentos por volumen, pricing por cliente, descuentos promocionales, reglas por temporada.

#### Pasos de implementación

- Definir interfaz PricingStrategy con calculate(items, customer, context): PriceResult.

- Crear estrategias: VolumeDiscountStrategy, VipPricingStrategy, PromoCodeStrategy.

- Componer estrategias si se requieren varias (chain) o permitir reemplazo único. Documentar orden de aplicación.

- Exponer selector por tenant / campaña / feature flag.

- Tests: combinaciones de estrategias (corner cases) y rounding/consistency tests.

- Auditar y registrar qué estrategia aplicó qué ajuste para facturación y soporte.

- Permitir toggles runtime (feature flags) para activar/desactivar estrategias.

### Cuándo usar / no usar

- Usar cuando reglas de pricing cambian frecuentemente o deben aplicarse de forma intercambiable.

- No usar si la lógica es trivial (única fórmula) o cuando el orden y composición son fijos y simples (en ese caso, una función pura puede bastar).

### 3) Selección de algoritmo de recomendación

**Qué resuelve**: recomendar items con distintos algoritmos: por popularidad, por historial, por ML/embedding; cada uno es una strategy.

#### Pasos de implementación

- Definir RecommendationStrategy con recommend(user, context): Item[].

- Implementar PopularityStrategy, CollaborativeFilteringStrategy, MLModelStrategy.

- Crear un orquestador que seleccione estrategia por experimento (A/B), por perfil de usuario o por campaña.

- Permitir mezcla/weighting de estrategias (p.ej. 70% ML + 30% Popularidad).

- Evaluación: métricas offline (precision/recall) y online (CTR, conversión). Tests A/B.

- Monitoring de drift del modelo y fallback a estrategias más simples si falla.

- Cache y TTL para respuestas costosas.

#### Cuándo usar / no usar

- Usar cuando quieras experimentar con múltiples algoritmos y cambiarlos sin tocar el core.

- No usar si la recomendación es estática o si la complejidad de integración (model serving) hace inviable abstraer simplemnte por strategy.

### 4) Estrategias de envío / logística

**Qué resuelve**: determinar cómo enviar un pedido: courier estándar, express, pickup, fulfillment partner; cada estrategia implementa createShipment().

#### Pasos de implementación

- Definir ShippingStrategy con createShipment(order): ShipmentResult y estimate(order): Estimation.

- Implementar CourierStrategy, PickupStrategy, LTLStrategy, ThirdPartyFulfillmentStrategy.

- Selector basado en reglas: peso, destino, SLA requerido, coste y restricciones del producto.

- Centralizar políticas de fallback (si courier falla, fallback a otro) y retry logic.

- Integración con carriers (APIs), manejo de webhooks (tracking updates).

- Tests de integración con sandbox de carriers y simulación de errores.

- Exponer en UI/checkout las opciones calculadas por la strategy y el detalle de costes/SLA.

#### Cuándo usar / no usar

- Usar cuando tengas múltiples proveedores o políticas complejas de enrutamiento.

- No usar si solo hay un proveedor único y reglas estáticas.
> ### Códigos
> - Revisa el código de los patos en cap1.ts
>
> - Otro ejemplo de una app de comidas con delivery en ShippingStrategy.ts

![Pato_quetru](https://www.redobservadores.cl/wp-content/uploads/2024/08/Quetru-volador-Benjamin-Gallardo.png)