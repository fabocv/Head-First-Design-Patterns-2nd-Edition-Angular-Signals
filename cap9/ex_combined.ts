/**
 * Ejercicio combinado de Combos de productos + productos fuera de combo
 * Se iteran los valores de cada productos de un combo,
 * luego ese subtotal se suma a los otros productos individuales.
 */

interface FoodItem {
  getName(): string;
  getPrice(): number;
}


class SimpleFood implements FoodItem {
  constructor(private name: string, private price: number) {}
  getName(): string { return this.name; }
  getPrice(): number { return this.price; }
}

/** Composite + Iterable: Combo puede contener FoodItem (incluyendo otros Combo) */
class Combo implements FoodItem, Iterable<FoodItem> {
  private items: FoodItem[] = [];

  add(item: FoodItem) {
    this.items.push(item);
  }

  getChildren(): FoodItem[] {
    return [...this.items]; // devolvemos copia para evitar mutación externa
  }

  getName(): string {
    return `Combo (${this.items.map(i => i.getName()).join(", ")})`;
  }

  getPrice(): number {
    return this.items.reduce((sum, i) => sum + i.getPrice(), 0);
  }

  // Iterator que "aplana" combos anidados y entrega hojas (SimpleFood u otros FoodItem)
  *[Symbol.iterator](): Iterator<FoodItem> {
    for (const item of this.items) {
      // si el item es iterable (p. ej. otro Combo), delegamos (flatten)
      if (isIterable(item)) {
        // @ts-ignore yield* with Iterable<FoodItem>
        yield* (item as Iterable<FoodItem>);
      } else {
        yield item;
      }
    }
  }
}

/** Pedido: colección de FoodItem (puede contener combos). También iterable y hace flatten */
class Order implements Iterable<FoodItem> {
  private items: FoodItem[] = [];

  add(item: FoodItem) { this.items.push(item); }

  // Iterator del pedido: recorre cada item y, si es iterable, lo desenrolla
  *[Symbol.iterator](): Iterator<FoodItem> {
    for (const item of this.items) {
      if (isIterable(item)) {
        // @ts-ignore
        yield* (item as Iterable<FoodItem>);
      } else {
        yield item;
      }
    }
  }

  // utilitarios
  getTotal(): number {
    let total = 0;
    for (const it of this) {
      total += it.getPrice();
    }
    return total;
  }

  summary(): string {
    const lines = ['Order summary:'];
    for (const it of this) {
      lines.push(` - ${it.getName()} : $${it.getPrice()}`);
    }
    lines.push(`TOTAL: $${this.getTotal()}`);
    return lines.join('\n');
  }
}

/** Type guard: detecta si algo es iterable de FoodItem */
function isIterable(x: unknown): x is Iterable<FoodItem> {
  return !!x && typeof (x as any)[Symbol.iterator] === 'function';
}

// ---------------- DEMO ----------------

const pizza = new SimpleFood('Pizza', 12500);
const empanadas = new SimpleFood('3x Empanaditas de Queso', 800);
const soda = new SimpleFood('Gaseosa', 1500);

// Combo simple
const combo1 = new Combo();
combo1.add(pizza);
combo1.add(empanadas);

// Combo anidado: combo que incluye otro combo + un soda
const megaCombo = new Combo();
megaCombo.add(combo1);
megaCombo.add(soda);

// Pedido que contiene items y combos
const order = new Order();
order.add(megaCombo);
order.add(new SimpleFood('Helado', 2000));

// Mostrar nombre y precio del combo (comportamiento existente)
console.log(megaCombo.getName());
console.log(`Precio (combo): $${megaCombo.getPrice()}\n`);

// Iterar el combo directamente (muestra elementos planos dentro)
console.log('Iterando megaCombo (flatten):');
for (const item of megaCombo) {
  console.log(` * ${item.getName()} - $${item.getPrice()}`);
}
console.log('');

// Iterar el pedido completo
console.log('Iterando order (flatten combos) y sumando:');
console.log(order.summary());
