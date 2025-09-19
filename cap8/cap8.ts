/**
 * Contexto: 1. Procesamiento de pagos multicanal
 * Qué resuelve: distintos proveedores (Stripe, PayPal, MercadoPago) siguen un flujo común:
 * validar → autorizar → ejecutar → confirmar.
 */

type PaymentContext = {
  orderId: string;
  amountCents: number;
  currency: string;
  paymentMethodData?: Record<string, unknown>;
};

type PaymentResult =
  | { success: true; provider: string; transactionId: string }
  | { success: false; provider: string; reason: string };

abstract class PaymentProcessor {
  // Template method — controla el flujo general
  public async processPayment(ctx: PaymentContext): Promise<PaymentResult> {
    const provider = this.providerName();
    try {
      // 1) Validar datos básicos
      const okValid = await this.validate(ctx);
      if (!okValid) return { success: false, provider, reason: 'validation_failed' };

      // 2) Autorizar (reserva/pre-autorización)
      const authOk = await this.authorize(ctx);
      if (!authOk) {
        await this.onAuthorizationFailed(ctx);
        return { success: false, provider, reason: 'authorization_failed' };
      }

      // 3) Ejecutar (captura / charge)
      const txId = await this.execute(ctx);

      // 4) Confirmar (post-processing / notifications)
      await this.confirm(ctx, txId);

      return { success: true, provider, transactionId: txId };
    } catch (err) {
      // hook para manejo de errores generales
      await this.onError(ctx, err instanceof Error ? err.message : String(err));
      return { success: false, provider, reason: (err as Error).message ?? 'unknown_error' };
    }
  }

  // --- pasos que subclases pueden implementar/override ---

  protected abstract providerName(): string;

  // Validación por defecto mínima
  protected async validate(ctx: PaymentContext): Promise<boolean> {
    const ok = !!ctx.orderId && ctx.amountCents > 0 && !!ctx.currency;
    return ok;
  }

  // Autorizar (por defecto: approve)
  protected async authorize(_ctx: PaymentContext): Promise<boolean> {
    return true;
  }

  // Ejecutar: debe devolver transactionId
  protected abstract execute(ctx: PaymentContext): Promise<string>;

  // Confirmar: notificar, persistir, desbloquear recursos, etc.
  protected async confirm(_ctx: PaymentContext, _txId: string): Promise<void> {
    // noop por defecto
  }

  // Hooks de error / falla
  protected async onAuthorizationFailed(_ctx: PaymentContext): Promise<void> {
    // noop por defecto (puedes encolar alerta)
  }

  protected async onError(_ctx: PaymentContext, _message: string): Promise<void> {
    // noop por defecto (log, metrics, retry)
  }
}

// ---------------- Concrete processors (simulados) ----------------

class StripeProcessor extends PaymentProcessor {
  protected providerName() { return 'Stripe'; }

  protected async authorize(ctx: PaymentContext) {
    // simula validación de tarjeta/token o reservation
    // en producción aquí llamas a la API de Stripe para crear un PaymentIntent
    return !!ctx.paymentMethodData?.['cardToken'];
  }

  protected async execute(ctx: PaymentContext): Promise<string> {
    // simula captura - retorna transaction id
    return `stripe_tx_${ctx.orderId}_${Date.now()}`;
  }

  protected async confirm(ctx: PaymentContext, txId: string) {
    // simular notificación / persistencia
    console.log(`[Stripe] Confirmed ${ctx.orderId} tx=${txId}`);
  }
}

class PayPalProcessor extends PaymentProcessor {
  protected providerName() { return 'PayPal'; }

  protected async authorize(_ctx: PaymentContext) {
    // PayPal flow might skip preauth; always return true in this simple example
    return true;
  }

  protected async execute(ctx: PaymentContext): Promise<string> {
    // simula redirección/checkout y captura
    return `paypal_tx_${ctx.orderId}_${Date.now()}`;
  }

  protected async confirm(_ctx: PaymentContext, txId: string) {
    console.log(`[PayPal] Capture logged tx=${txId}`);
  }
}

class MercadoPagoProcessor extends PaymentProcessor {
  protected providerName() { return 'MercadoPago'; }

  protected async authorize(ctx: PaymentContext) {
    // Simula que requiere an id de payer
    return !!ctx.paymentMethodData?.['payerId'];
  }

  protected async execute(ctx: PaymentContext): Promise<string> {
    return `mp_tx_${ctx.orderId}_${Date.now()}`;
  }

  protected async confirm(_ctx: PaymentContext, txId: string) {
    console.log(`[MercadoPago] Confirmed tx=${txId}`);
  }
}

// ---------------- Demo ----------------

async function demo() {
  const ctx: PaymentContext = {
    orderId: 'o-100',
    amountCents: 1999,
    currency: 'USD',
    paymentMethodData: { cardToken: 'tok_visa_123' } // para Stripe
  };

  const processors: PaymentProcessor[] = [
    new StripeProcessor(),
    new PayPalProcessor(),
    new MercadoPagoProcessor(),
  ];

  for (const p of processors) {
    const res = await p.processPayment(ctx);
    console.log('Result:', res);
  }

  // Demo: authorization fail (Stripe without cardToken)
  const badCtx = { ...ctx, paymentMethodData: {} };
  const stripe = new StripeProcessor();
  console.log('Stripe with missing token:', await stripe.processPayment(badCtx));
}


demo().catch(e => console.error(e));

