interface Payment {
    pay(amount: number): void;
}

class StripeService {
    makePayment(price: number) {
        console.log(`Pagando  $${price}  con Stripe`)
    }
}

class StripeAdapter implements Payment {
    constructor(private stripe: StripeService) {}

    pay(amount: number): void {
        this.stripe.makePayment(amount);
    }
}

//uso
const payment: Payment = new StripeAdapter(new StripeService());
payment.pay(1810);