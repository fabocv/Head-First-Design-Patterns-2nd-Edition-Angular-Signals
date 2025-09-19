/**
 * Contexto: dada una app de comida con delivery, se crea un facade operacional
 * que avisa al repartidor que tiene un pedido por entregar, validandose previamente
 * el pedido y el proceso de pago. Se simula el proceso.
 */

type StartDeliveryResult =
{ success: true; orderId: string; message: string }
| { success: false; orderId: string; reason: string };

class OrderService {
    // Estado simulado en memoria 
    private readyOrders = new Set<string>();    
    markReady(orderId: string) {
        this.readyOrders.add(orderId);
    }   
    isReady(orderId: string): boolean {
        return this.readyOrders.has(orderId);
    }
}

class PaymentService {
    private paidOrders = new Set<string>(); 
    markPaid(orderId: string) {
        this.paidOrders.add(orderId);
    }   
    isPaid(orderId: string): boolean {
        return this.paidOrders.has(orderId);
    }
}

class DeliveryService {
    private activeDeliveries = new Set<string>();   
    startDelivery(orderId: string) {
        if (this.activeDeliveries.has(orderId)) {
            throw new Error('Delivery already started for order ' + orderId);
        }
        this.activeDeliveries.add(orderId);
        // Aquí iría la integración real con el carrier
    }   
    isDelivering(orderId: string): boolean {
        return this.activeDeliveries.has(orderId);
    }
}

class OrderFacade {
    constructor(
        private orderSvc: OrderService,
        private paymentSvc: PaymentService,
        private deliverySvc: DeliveryService
    ) {}

  /**
   * Inicio del delivery para una orderId.
   * - Requiere: order listo + pago aceptado.
   * - No es asíncrono: todo en memoria / síncrono.
   */
    startDeliveryIfReady(orderId: string): StartDeliveryResult {
        if (!this.orderSvc.isReady(orderId)) {
            return { success: false, orderId, reason: 'Order not ready' };
        } 
        if (!this.paymentSvc.isPaid(orderId)) {
            return { success: false, orderId, reason: 'Payment not confirmed' };
        } 
        if (this.deliverySvc.isDelivering(orderId)) {
            return { success: false, orderId, reason: 'Delivery already in progress' };
        } 
        try {
            this.deliverySvc.startDelivery(orderId);
            return { success: true, orderId, message: 'Delivery started' };
        } catch (err) {
            return { success: false, orderId, reason: (err as Error).message };
        }
    }
}

// --- Demo ---
const orderSvc = new OrderService();
const paymentSvc = new PaymentService();
const deliverySvc = new DeliveryService();
const facade = new OrderFacade(orderSvc, paymentSvc, deliverySvc);

const id = 'order-53';

// Simula: marcar order listo y pago aceptado
orderSvc.markReady(id);
paymentSvc.markPaid(id);

// Intentar iniciar el delivery
console.log("- Iniciando el delivery.")
const res = facade.startDeliveryIfReady(id);
console.log(res); // { success: true, orderId: 'order-42', message: 'Delivery started' }

// Intentar de nuevo (idempotencia observada)
console.log("\n- Reintentando iniciar el delivery.")
const res2 = facade.startDeliveryIfReady(id);
console.log(res2); // { success: false, orderId: 'order-42', reason: 'Delivery already in progress' }