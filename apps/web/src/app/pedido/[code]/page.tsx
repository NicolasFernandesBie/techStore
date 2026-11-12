import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CheckCircle2, CreditCard, MapPin, Package, Truck } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { formatBRL, formatDate } from '@/lib/format'
import { orderStatusLabel, orderStatusTone, paymentLabel } from '@/lib/status'
import type { Order } from '@/lib/types'

export const metadata: Metadata = { title: 'Pedido confirmado' }

export default async function OrderConfirmationPage({ params }: { params: { code: string } }) {
  let fetched: Order | null = null
  try {
    fetched = await apiFetch<Order>(`/api/v1/orders/code/${encodeURIComponent(params.code)}`)
  } catch {
    fetched = null
  }
  if (!fetched) notFound()
  const order: Order = fetched

  return (
    <div className="container-page py-10">
      <div className="card overflow-hidden">
        <div className="flex flex-col items-center gap-3 border-b border-slate-100 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-500/10 px-6 py-8 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pedido confirmado</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Obrigado pela compra! Seu pedido <strong>{order.code}</strong> foi registrado.
            </p>
          </div>
          <span className={`badge ${orderStatusTone[order.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
            {orderStatusLabel[order.status] || order.status}
          </span>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <Package className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              Itens do pedido
            </h2>
            <ul className="mt-4 space-y-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-lg border border-slate-100 dark:border-slate-800 p-3">
                  <div className="relative h-14 w-14 shrink-0 rounded-md bg-slate-50 dark:bg-slate-800">
                    <Image src={item.productImage} alt={item.productName} fill sizes="56px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.productName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatBRL(item.unitPriceCents)} · Qtd. {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatBRL(item.totalCents)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-100 dark:border-slate-800 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4" /> Entrega
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{order.shippingAddress}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {order.shippingCity} - {order.shippingState} · CEP {order.shippingZip}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 dark:border-slate-800 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Truck className="h-4 w-4" /> Frete
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{order.shippingMethod}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {order.shippingCents === 0 ? 'Grátis' : formatBRL(order.shippingCents)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 dark:border-slate-800 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <CreditCard className="h-4 w-4" /> Pagamento
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  {paymentLabel[order.paymentMethod] || order.paymentMethod} · {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-4">
            <div className="rounded-lg border border-slate-100 dark:border-slate-800 p-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Resumo</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <dt>Subtotal</dt>
                  <dd>{formatBRL(order.subtotalCents)}</dd>
                </div>
                {order.discountCents > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <dt>Desconto {order.couponCode ? `(${order.couponCode})` : ''}</dt>
                    <dd>-{formatBRL(order.discountCents)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <dt>Frete</dt>
                  <dd>{order.shippingCents === 0 ? 'Grátis' : formatBRL(order.shippingCents)}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-base font-bold text-slate-900 dark:text-white">
                  <dt>Total</dt>
                  <dd>{formatBRL(order.totalCents)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Realizado em {formatDate(order.createdAt)}</p>
            </div>

            <div className="rounded-lg border border-slate-100 dark:border-slate-800 p-4 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">Cliente</p>
              <p className="mt-1">{order.customerName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{order.customerEmail}</p>
            </div>

            <Link href="/produtos" className="btn-primary w-full">
              Continuar comprando
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
