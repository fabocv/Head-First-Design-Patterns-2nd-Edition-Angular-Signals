# Capítulo 9 Well-Managed Collections: the Iterator and Composite Patterns

## Similitudes

Ambos son patrones de diseño estructurales/comportamentales destinados a trabajar con colecciones/estructuras de objetos.

Desacoplan al cliente de la implementación concreta:

Iterator desacopla la travesía (cómo se recorre) de la colección.

Composite desacopla el uso (cómo se trata un objeto) de la estructura jerárquica.

Permiten que el cliente trate elementos de forma uniforme:

Iterator expone una interfaz de recorrido uniforme (next, hasNext).

Composite permite tratar hojas y composites con la misma interfaz (operation()).

Se usan frecuentemente juntos: Composite modela la estructura en árbol y Iterator la recorre sin exponer la estructura interna.

| Aspecto                           |                                                                                                 Iterator | Composite                                                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------- |
| **Intención**                     | Proveer un mecanismo para recorrer los elementos de una colección sin exponer su representación interna. | Componer objetos en estructuras árbol para que cliente trate hojas y compuestos de la misma forma.                            |
| **Problema que resuelve**         |                      Separar la lógica de recorrido del contenedor; soportar múltiples formas de iterar. | Permitir que clientes manipulen jerarquías (árboles) como si fueran objetos individuales.                                     |
| **Estructura**                    |                                                       Normalmente: `Iterator` + `Aggregate` (colección). | `Component` (interfaz), `Leaf` y `Composite` (contiene children).                                                             |
| **Enfoque**                       |                                                                 Comportamiento (cómo se accede/recorre). | Estructural (cómo se organiza/agrupa).                                                                                        |
| **API visible al cliente**        |                                                        `hasNext()`, `next()` (o `forEach` / generators). | `operation()` y métodos para manejar hijos (`add`, `remove`, `getChild`).                                                     |
| **Recursividad**                  |                          No inherentemente recursivo (pero un iterator sobre árbol puede ser recursivo). | Naturalmente recursivo (composite contiene composites).                                                                       |
| **Cuándo aumenta la complejidad** |                            Cuando necesitas muchos tipos de recorrido (orden, filtrado, lazy, paralelo). | Cuando la jerarquía tiene reglas diferentes entre nodos; Composite puede requerir excepciones para operaciones no aplicables. |



## Ejemplos concretos y roles

### Iterator:
- colección de órdenes, stream de eventos, generator para paginación.

    - Beneficio: implementar distintos recorridos (in-order, pre-order, filtros) sin cambiar la colección.

### Composite:
- menú de UI (menu → submenu → items), árbol de archivos, estructura organizacional (departamentos → equipos → empleados).

    - Beneficio: aplicar operaciones (render, calcular coste, validar) recursivamente sobre todo el árbol.

### ¿Cuándo usarlos (y combinarlos)?

Usa Composite cuando tu dominio tiene una jerarquía natural y quieres tratar hojas y nodos uniformemente.

Usa Iterator cuando necesitas separar y reutilizar distintas estrategias de recorrido sobre una colección (o sobre una estructura compuesta).

#### Combínalos cuando:

Tienes un Composite (árbol) y necesitas exponer formas de recorrerlo (preorden, postorden, por niveles, filtrado). Implementa un TreeIterator que recorra el Composite sin que el cliente acceda a children internamente.

### Ejemplo de interacción (conceptual)

- Component (Composite) expone getChildren() (privado o protegido).

- TreeIterator toma un Component root y produce nodos en el orden deseado; el cliente usa solo el iterator para recorrer y aplicar operation().

### Riesgos y consideraciones

- Composite puede violar el principio de interfaz limpia si pones métodos add/remove en la interfaz Component y hojas no los implementan de forma natural — documenta / separa interfaces si hace falta (Interface Segregation).

- Iterator sobre estructuras mutables: si la estructura cambia mientras iteras, necesitas manejar concurrencia o fail-fast behavior.

- Performance: iteradores que generan recursion en árboles profundos pueden agotar stack; prefiere iteradores explícitos (stack manual) o generators.

- Complejidad combinada: demasiados tipos de iteradores para una jerarquía compleja puede generar muchos objetos — mantén un registry/Factory de iteradores si proliferan.

## Reglas prácticas 

- Si el problema es cómo agrupar y aplicar operaciones, piensa Composite.
- Si el problema es cómo recorrer esa agrupación o colección, piensa Iterator.
- No confundas: Composite organiza; Iterator navega. Úsalos en pareja cuando quieras una jerarquía y múltiples formas de recorrerla.

## Resumen
“El Composite construye el árbol; el Iterator lo recorre. Juntos te dan poder para modelar jerarquías y navegar por ellas sin ensuciar el código.”

# Ejemplos

## Ejercicio 1
### Pedidos de comidas con Combos
**Qué resuelve:** suponiendo una app de comida a domicilio, el usuario puede seleccionar una combinación de Combos de productos + productos fuera de combo.
 * Se iteran los valores de cada productos de un combo,
 * luego ese subtotal se suma a los otros productos individuales.
 
>(código en [ex_combined.ts](ex_combined.ts))

Hay una versión más simple en [ex_composite.ts](ex_composite.ts)

## Ejercicio 2: 

### Sección de jerarquía  de sub-departamentos y empleados de una organización.

**Qué resuelve:** modelar una jerarquía (departamentos que contienen sub-departamentos y empleados) y permitir recorrerla sin que el cliente conozca la estructura interna.

### Estrategia:

- **Composite**: OrgComponent (abstracto) → Employee (hoja) y Department (composite con children).

- **Iterator**: TreeIterator que implementa Iterable\<OrgComponent> y soporta dos estrategias de recorrido: preorder (DFS) y breadth-first (BFS).

Separación de responsabilidades: la estructura (composición) no contiene lógica de recorrido; el TreeIterator encapsula el algoritmo de recorrido.

Mira y comprende el código [acá.](cap9.ts)