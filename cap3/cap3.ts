/**
 * Decorator example:
 * Agregar toppings o extras a los pedidos hechos en una app de comida
 */

interface BasicFood {
    getDescription(): string;
    getCost(): number;
}

class BasicPizza implements BasicFood {
    getDescription(): string {
        return "Pizza Napolitana"
    }

    getCost(): number {
        return 12500;
    }
}

class CheeseDecorator implements BasicFood {

    constructor(private food: BasicFood){}

    getDescription(): string {
        return this.food.getDescription() + " with Extra Cheese"
    }

    getCost(): number {
        return this.food.getCost() + 2500;
    }
}

class BaconDecorator implements BasicFood {
    constructor(private food: BasicFood){}

    getDescription(): string {
        return this.food.getDescription() + " with Extra Bacon";
    }

    getCost(): number {
        return this.food.getCost() + 3500;
    }
}

let pizza = new BasicPizza();
pizza = new CheeseDecorator(pizza);

console.log(pizza.getDescription()); // Pizza Napolitana with Extra Cheese
console.log(pizza.getCost()); // 15000