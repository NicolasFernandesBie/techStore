'use client'

import { useState } from 'react'
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import type { Product } from '@/lib/types'

export function ProductActions({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const soldOut = product.stock <= 0
  const max = Math.max(1, Math.min(product.stock, 10))

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        priceCents: product.priceCents,
        stock: product.stock,
      },
      quantity,
    )
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Quantidade</span>
        <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 disabled:opacity-40"
            disabled={soldOut || quantity <= 1}
            aria-label="Diminuir quantidade"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(max, value + 1))}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 disabled:opacity-40"
            disabled={soldOut || quantity >= max}
            aria-label="Aumentar quantidade"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button type="button" onClick={handleAdd} disabled={soldOut} className="btn-primary w-full py-3">
        {soldOut ? (
          'Produto esgotado'
        ) : added ? (
          <>
            <Check className="h-4 w-4" />
            Adicionado ao carrinho
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Adicionar ao carrinho
          </>
        )}
      </button>
    </div>
  )
}
