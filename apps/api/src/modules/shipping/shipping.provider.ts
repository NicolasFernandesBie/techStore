export type ShippingOption = {
  id: string
  label: string
  priceCents: number
  days: string
}

export interface ShippingProvider {
  quote(input: { zip: string; subtotalCents: number }): ShippingOption[]
}

export class SimulatedShippingProvider implements ShippingProvider {
  quote({ subtotalCents }: { zip: string; subtotalCents: number }): ShippingOption[] {
    const freeShipping = subtotalCents >= 50000
    return [
      {
        id: 'PAC',
        label: 'PAC (simulado)',
        priceCents: freeShipping ? 0 : 1990,
        days: '5 a 8 dias úteis',
      },
      {
        id: 'SEDEX',
        label: 'SEDEX (simulado)',
        priceCents: freeShipping ? 990 : 3490,
        days: '2 a 4 dias úteis',
      },
      {
        id: 'RETIRADA',
        label: 'Retirada na loja (simulado)',
        priceCents: 0,
        days: 'Retirar hoje',
      },
    ]
  }
}

export const shippingProvider: ShippingProvider = new SimulatedShippingProvider()
