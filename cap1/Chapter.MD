# Capítulo 1: Welcome to Design Patterns: intro to Design Patterns

## Introducción

Los autores inician el viaje de aprendizaje mencionando los principios de programación orientada a objetos. Señalan que la idea de este libro es reusar experiencias aprendidas de los patrones en vez de reusar código de manera mecánicamente.


> ## Primer Principio de diseño:

> Dado un problema donde no se quiere implementar interfaces inútiles en un modelo porque ciertas variaciones tienen características que otras no, se sugiere separar lo que cambia (comportamiento) de lo que permanece estable, identificando los aspectos comunes del problema y encapsulando las variaciones como implementaciones específicas. Esto define al **patrón Strategy.**

# Patrón Strategy

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

> Revisa el código en cap1.ts

![Pato_quetru](https://www.redobservadores.cl/wp-content/uploads/2024/08/Quetru-volador-Benjamin-Gallardo.png)