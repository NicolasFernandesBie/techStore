'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string
  slug: string
  name: string
  imageUrl: string
  priceCents: number
  stock: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((current) => current.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((current) =>
                current.productId === item.productId
                  ? {
                      ...current,
                      quantity: Math.min(current.quantity + quantity, current.stock),
                    }
                  : current,
              ),
            }
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantity, item.stock) }],
          }
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
              : item,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'techstore-cart' },
  ),
)

export function cartSubtotalCents(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
