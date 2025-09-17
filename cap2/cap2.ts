/*  source https://youtu.be/GIS0_1kVBEM?si=QLKGjFtdtf6mn6zL&t=5833
    Te enseño TODOS los PATRONES de DISEÑO y cúando APLICARLOS - Gentleman Programming

    Acá implementan un servicio de una app de comidas a domicilio
    y se usa el patrón Observer para activar la reactibilidad de los sujetos
    bajo un cambio de orden del pedido.
*/
interface Observer {
    update(orderId: string): void;
}

class Kitchen implements Observer {
    update(orderId: string): void {
        console.log("Cocina: preparando orden");
    }
}

class Delivery implements Observer {
    update(orderId: string): void {
        console.log("Delivery: esperando orden");
    }
}

class OrderSubject {
    private observers : Observer[] = [];
    addObserver(obs: Observer) {
        this.observers.push(obs)
    }
    notify(orderId: string) {
        this.observers.forEach((o) => o.update(orderId));
    }
}

const subject = new OrderSubject();
subject.addObserver(new Kitchen());
subject.addObserver(new Delivery());
subject.notify("abc112")