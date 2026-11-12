'use server'

import { apiFetch } from '../api'
import { getToken } from '../session'
import type { ActionResult, Order, ShippingOption } from '../types'

export async function quoteShippingAction(
  zip: string,
  subtotalCents: number,
): Promise<{ ok: boolean; options?: ShippingOption[]; error?: string }> {
  try {
    const data = await apiFetch<{ options: ShippingOption[] }>('/api/v1/shipping/quote', {
      method: 'POST',
      body: { zip, subtotalCents },
    })
    return { ok: true, options: data.options }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}

export async function placeOrderAction(input: {
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingMethod: string
  paymentMethod: 'PIX' | 'CARD' | 'BOLETO'
  couponCode?: string
  items: { productId: string; quantity: number }[]
}): Promise<ActionResult> {
  try {
    const token = getToken()
    const order = await apiFetch<Order>('/api/v1/orders', {
      method: 'POST',
      body: input,
      token,
    })
    return { ok: true, code: order.code }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}
