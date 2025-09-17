/**
 * Contexto: una app de comida con delivery necesita calcular
 * la estrategia de envío (gratis o  por distancia)
 * Fuente https://youtu.be/GIS0_1kVBEM?si=QfpuKxOOQkkH5yGf&t=6290
 */

interface ShippingStrategy {
    calculate(amount: number): number;
}

class  DistanceShipping  implements ShippingStrategy {
    calculate(amount: number): number {
        return amount * 1.2;
    }
}

class FreeShipping implements ShippingStrategy {
    calculate(amount: number): number {
        return 0;
    }
}

class ShippingContext {
    constructor(private strategy: ShippingStrategy){} //injection
    getShippingCost(amount: number) {
        return this.strategy.calculate(amount);
    }
}

const context = new ShippingContext(new DistanceShipping())
context.getShippingCost(100); // Output: 120

const freeContext = new ShippingContext(new FreeShipping())
freeContext.getShippingCost(100); // Output: 0