/**
 * Agregar combos o extras a un pedido de comida
 * Ej: agregar empanadas a un pedido de pizza
 */

interface FoodItem {
    getName(): string;
    getPrice(): number;
}

class SimpleFood implements FoodItem {
    constructor(private name: string, private price: number){}

    getName(): string {
        return this.name;
    }
    getPrice(): number {
        return this.price;
    }
}

class Combo implements FoodItem {
    private items: FoodItem[] = [];
    
    add(item: FoodItem){
        this.items.push(item);
    }
    getName(): string {
        return `Combo ${this.items.map((i) => i.getName()).join(", ")}`;
    }

    getPrice(): number {
        return this.items.reduce((sum, i) => sum + i.getPrice(), 0)
    }
}

// DEMO

const Pizza = new SimpleFood("Pizza", 12500);
const Empanadas = new SimpleFood("3x Empanaditas de Queso", 800);
const combo = new Combo();
combo.add(Pizza)
combo.add(Empanadas)

console.log(combo.getName())
console.log(`TOTAL: $${combo.getPrice()}`)