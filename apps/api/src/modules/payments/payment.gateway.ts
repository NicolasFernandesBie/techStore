export type PaymentMethod = 'PIX' | 'CARD' | 'BOLETO'

export type PaymentResult = {
  status: 'APPROVED' | 'DECLINED'
  txId: string
}

export interface PaymentGateway {
  charge(input: {
    amountCents: number
    method: PaymentMethod
    orderCode: string
  }): Promise<PaymentResult>
}

export class SimulatedPaymentGateway implements PaymentGateway {
  async charge({ method, orderCode }: { amountCents: number; method: PaymentMethod; orderCode: string }): Promise<PaymentResult> {
    return {
      status: 'APPROVED',
      txId: `SIM-${method}-${orderCode}-${Date.now().toString(36).toUpperCase()}`,
    }
  }
}

export const paymentGateway: PaymentGateway = new SimulatedPaymentGateway()
