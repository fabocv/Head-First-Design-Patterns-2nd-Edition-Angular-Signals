interface OrderHistory {
    getOrders(userId:string): string[];
}

class RealOrderHistory implements OrderHistory {
    getOrders(userId: string): string[] {
        console.log("consultando a bd");
        return ["Pedido 1", "Pedido 2"];
    }
}

class OrderHistoryProxy implements OrderHistory {
    private cache: Record <string, string[]> = {};
    constructor(private realHistory: RealOrderHistory){}
    getOrders(userId: string): string[] {
        if (!this.cache[userId]){
            this.cache[userId] = this.realHistory.getOrders(userId);
        }
        return this.cache[userId];
    }
}

//DEMO
const history = new OrderHistoryProxy(new RealOrderHistory());
console.log(history.getOrders("user1")); // consultando a bd [ 'Pedido 1', 'Pedido 2' ]
console.log(history.getOrders("user1")); //[ 'Pedido 1', 'Pedido 2' ]