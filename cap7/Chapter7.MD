# Capítulo 7: Being Adaptive: the Adapter and Facade Patterns

### Adapter

El Adapter es un patrón estructural que permite que dos interfaces incompatibles trabajen juntas sin modificar su código original. Actúa como un “traductor” entre un cliente y una clase/servicio externo. [más detalles en este markdown](Chapter7-adapter.MD)

### Facade

Ofrece una interfaz simple y unificada a un subsistema complejo. La fachada (facade) oculta la complejidad y coordina llamadas a múltiples componentes internos para que el cliente vea una API sencilla. [ver mas detalles acá](Chapter7-facade.MD)

## Patrón Adapter | Estructural

El Adapter es un patrón estructural que permite que dos interfaces incompatibles trabajen juntas sin modificar su código original. Actúa como un “traductor” entre un cliente y una clase/servicio externo.


## Conexiones entre Adapter y Facade

- **Ambos son patrones estructurales** → buscan mejorar cómo las clases se relacionan, sin cambiar su funcionalidad interna.

- **Ambos actúan como intermediarios** → se colocan entre cliente y sistema, para dar una capa de simplicidad.

- **Ambos reducen acoplamiento** → el cliente ya no conoce los detalles de implementación.

- **Ambos mejoran mantenibilidad** → hacen que integrar y evolucionar sistemas sea menos costoso.

## Tabla comparativa

| Aspecto           | Adapter                                                                         | Facade                                                                            |
| ----------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Propósito**     | Traducir una interfaz existente a la que el cliente necesita.                   | Simplificar el acceso a un sistema complejo ofreciendo una interfaz unificada.    |
| **Motivación**    | Resolver **incompatibilidad** entre interfaces.                                 | Resolver **complejidad** de un subsistema.                                        |
| **Grano**         | Generalmente afecta a **una sola clase** (o unas pocas).                        | Opera sobre **módulos o subsistemas enteros**.                                    |
| **Uso típico**    | Integrar librerías externas, APIs antiguas o sistemas con interfaces distintas. | Exponer un conjunto de funcionalidades bajo una interfaz más limpia y entendible. |
| **Orientación**   | Hace que “**esto hable el idioma del cliente**”.                                | Hace que “**todo este sistema se vea sencillo para el cliente**”.                 |
| **Reutilización** | Facilita el uso de algo existente sin modificarlo.                              | Facilita el acceso a algo complejo pero no lo transforma.                         |


### Ejemplos

- **Adapter**: Tengo un enchufe europeo y quiero conectarlo en Chile → necesito un adaptador físico que traduzca la forma de la clavija.

- **Facade**: Tengo un sistema eléctrico con generadores, transformadores y subestaciones → el interruptor de la pared me da una interfaz simple: prender y apagar.

### Cuándo elegir uno u otro?

- Usa Adapter si el problema es incompatibilidad de interfaces.

- Usa Facade si el problema es exceso de complejidad.

## Resumen
A veces puedes usar ambos juntos: un Facade puede exponer un sistema simple al cliente, y detrás usar Adapters para normalizar fuentes o servicios incompatibles.

![enchufes](https://m.media-amazon.com/images/I/51FlM-7UNAL._AC_SL1100_.jpg)