'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { cartSubtotalCents, useCartStore } from '@/lib/cart-store'
import { useHydrated } from '@/lib/use-hydrated'
import { formatBRL } from '@/lib/format'

export function CartView() {
  const items = useCartStore((state) => state.items)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const hydrated = useHydrated()

  if (!hydrated) {
    return <div className="card p-10 text-center text-sm text-slate-500 dark:text-slate-400">Carregando carrinho...</div>
  }

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 p-12 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Seu carrinho está vazio</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Explore nosso catálogo e encontre o setup ideal.</p>
        </div>
        <Link href="/produtos" className="btn-primary">
          Ver produtos
        </Link>
      </div>
    )
  }

  const subtotal = cartSubtotalCents(items)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="card flex gap-4 p-4">
            <div className="relative h-24 w-24 shrink-0 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/produtos/${item.slug}`}
                  className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-300"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 transition hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600"
                  aria-label="Remover item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatBRL(item.priceCents)} cada</p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 disabled:opacity-40"
                    disabled={item.quantity >= item.stock}
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatBRL(item.priceCents * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit space-y-4">
        <div className="card p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Resumo</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <dt>Frete</dt>
              <dd className="text-slate-400 dark:text-slate-500">calculado no checkout</dd>
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-base font-bold text-slate-900 dark:text-white">
              <dt>Total parcial</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
          </dl>

          <Link href="/checkout" className="btn-primary mt-5 w-full py-3">
            Finalizar compra
          </Link>
          <Link href="/produtos" className="btn-outline mt-2 w-full">
            Continuar comprando
          </Link>
        </div>

        <p className="px-1 text-xs text-slate-400 dark:text-slate-500">
          Frete e pagamento são simulados neste projeto acadêmico.
        </p>
      </aside>
    </div>
  )
}
