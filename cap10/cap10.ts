interface OrderState {
    next(order: OrderContext): void;
    getStatus(): string;
}

class OrderContext {
    private state: OrderState;
    constructor() {
        this.state = new NewOrder();
    }
    setState(state: OrderState) {
        this.state = state;
    }
    next() {
        this.state.next(this);
    }
    getStatus(){
        return this.state.getStatus();
    }
}

class NewOrder implements OrderState {
    next(order: OrderContext): void {
        order.setState(new CookingOrder());
    }
    getStatus(): string {
        return "Nuevo Pedido"
    };
    
}
 class CookingOrder implements OrderState {
     next(order: OrderContext): void {
         order.setState(new DeliveryOrder())
     }
     getStatus(): string {
         return "En cocina";
     }
 }

 class DeliveryOrder implements OrderState {
     next(order: OrderContext): void {
         order.setState(new DeliveredOrder())
     }
     getStatus(): string {
         return "En entrega"
     }

 }

 class DeliveredOrder implements OrderState {
    next(order: OrderContext): void {
        console.log("Pedido entregado")
     }
     getStatus(): string {
         return "Entregado"
     }
 }


//DEMO
const order = new OrderContext();
console.log(order.getStatus());
order.next();
console.log(order.getStatus());
order.next();
console.log(order.getStatus());
order.next();
console.log(order.getStatus());
order.next();