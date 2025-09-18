/**
 * Patrón Command
 * Contexto: app de comida para llevar que registra los movimientos de items (hacer y deshacer) en un log
 */

interface Command {
    execute(): void;
    undo(): void; // puede lanzar si no es posible deshacer
    isExecuted?: boolean;
}

class AddItemCommand implements Command {
    private executed = false;
    private insertedIndex: number | null = null;
    private logs: string[] = [];    
    constructor(
        private order: string[],   // lista mutable compartida
        private item: string
    ) {}    
    execute(): void {
        if (this.executed) return; // idempotencia básica
        this.insertedIndex = this.order.length;
        this.order.push(this.item);
        this.logs.push(`Agregado ${this.item} at index ${this.insertedIndex}`);
        this.executed = true;
    }   
    undo(): void {
        if (!this.executed) return;
        if (this.insertedIndex == null) return;
        // Solo remover si el item sigue en el índice esperado
        if (this.order[this.insertedIndex] === this.item) {
            this.order.splice(this.insertedIndex, 1);
            this.logs.push(`Deshacer ${this.item} from index ${this.insertedIndex}`);
        } else {
            // fallback: buscar desde atrás y eliminar la primera coincidencia
            const i = this.order.lastIndexOf(this.item);
            if (i >= 0) {
              this.order.splice(i, 1);
              this.logs.push(`Deshacer ${this.item} (fallback removed at ${i})`);
            } else {
              this.logs.push(`Deshacer ${this.item} falló: no encontrado`);
            }
        }
        this.executed = false;
        this.insertedIndex = null;
    }   
    // helper para tests/debug
    getLogs() {
        return [...this.logs];
    }
}

// demo
const order: string[] = [];
const addPizza = new AddItemCommand(order, "Pizza");
addPizza.execute();
addPizza.undo();
console.log(order); // []
console.log(addPizza.getLogs());
