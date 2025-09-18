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
        return amount * 0.2;
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

const compraBase = 100;
const context = new ShippingContext(new DistanceShipping())
const shippingCost1 = context.getShippingCost(compraBase); 
console.log(`Costo envío:$${shippingCost1}, Total a pagar: $${compraBase + shippingCost1}`); // Output: 120

const freeContext = new ShippingContext(new FreeShipping())
const shippingCost2 = freeContext.getShippingCost(compraBase); 
console.log(`Costo envío:$${shippingCost2}, Total a pagar: $${compraBase + shippingCost2}`); // Output: 120
