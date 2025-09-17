## Capítulo 2: Keeping your Objects in the Know: the Observer Patterns

# Patrón Observer | Comportamiento

**Propósito:** define una relación uno a muchos entre objetos. Cuando un objeto (“sujeto”) cambia de estado, notifica automáticamente a sus “observadores”.

**Idea clave:** desacoplar el emisor de eventos (subject) de los receptores (observers).

### Usos típicos:

Sistemas de eventos (UI, Angular signals, RxJS observables).

Comunicación entre componentes sin acoplarlos directamente.

Modelar flujos reactivos o pub-sub.

### ✅ Pros

- Desacoplamiento fuerte → el subject no necesita saber quién lo escucha.

- Escalabilidad → puedes agregar o quitar observadores sin tocar el subject.

- Extensibilidad → permite crear sistemas reactivos y plugin-based.

- Natural para GUIs y flujos asíncronos → base de eventos en Angular, React, etc.

### ❌ Contras

- Orden de notificación no garantizado → los observers se notifican, pero no hay control fuerte sobre el orden ni sobre fallos de uno afectando a otros.

- Difícil de depurar → las cadenas de eventos pueden generar efectos secundarios no obvios (¿quién me notificó?).

- Posible sobrecarga de eventos → muchos observadores = mucho overhead, incluso si no hacen nada útil.

- Fugas de memoria → si un observer no se desuscribe, puede quedar en memoria (clásico bug en Angular/RxJS).

- Complejidad accidental → para escenarios simples, un callback directo es más claro que un sistema Observer formal.


## Ejemplos

