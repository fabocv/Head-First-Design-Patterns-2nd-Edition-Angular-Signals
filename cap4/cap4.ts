/**
 * Contexto: creamos una fábrica de pizza y sushis de manera simple
 */

interface Food {
    prepare(): void;
}

class Pizza implements Food {
    prepare(): void {
        console.log ("preparando una pizza")
    }
}

class Sushi implements Food {
    prepare(): void {
        console.log("cocinando el sushi")
    }
}

const tiposDeComida = {
    pizza: Pizza,
    sushi: Sushi
}

class FoodFactory {
    static createFood(type: keyof typeof tiposDeComida): Food {
        return new tiposDeComida[type]();
    }
}

const factory = FoodFactory.createFood("sushi");
factory.prepare();