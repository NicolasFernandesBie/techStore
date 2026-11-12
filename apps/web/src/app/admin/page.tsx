import Link from 'next/link'
import { AlertTriangle, DollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { getToken } from '@/lib/session'
import { formatBRL, formatDate } from '@/lib/format'
import { orderStatusLabel, orderStatusTone } from '@/lib/status'
import type { AdminStats } from '@/lib/types'

export default async function AdminDashboardPage() {
  const token = getToken()
  let stats: AdminStats | null = null

  try {
    stats = await apiFetch<AdminStats>('/api/v1/admin/stats', { token })
  } catch {
    stats = null
  }

  if (!stats) {
    return (
      <div className="card p-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Não foi possível carregar os indicadores. Verifique a API.
      </div>
    )
  }

  const cards = [
    { label: 'Faturamento', value: formatBRL(stats.revenueCents), icon: DollarSign, tone: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
    { label: 'Pedidos pagos', value: String(stats.paidOrders), icon: ShoppingBag, tone: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
    { label: 'Ticket médio', value: formatBRL(stats.averageTicketCents), icon: TrendingUp, tone: 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' },
    { label: 'Produtos', value: String(stats.productsCount), icon: Package, tone: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' },
  ]

  const maxQuantity = Math.max(1, ...stats.topProducts.map((product) => product.quantity))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Visão geral da operação da TechStore.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="card p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-lg ${card.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            </div>
          )
        })}
      </div>

      {stats.lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>
            <strong>{stats.lowStockCount}</strong> produto(s) com estoque baixo (5 unidades ou menos).{' '}
            <Link href="/admin/produtos" className="font-semibold underline">Revisar estoque</Link>
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Produtos mais vendidos</h2>
          {stats.topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Nenhuma venda registrada ainda.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {stats.topProducts.map((product) => (
                <li key={product.name}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-slate-700 dark:text-slate-200">{product.name}</span>
                    <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{product.quantity} un.</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${Math.round((product.quantity / maxQuantity) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Pedidos recentes</h2>
            <Link href="/admin/pedidos" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
              Ver todos
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Nenhum pedido ainda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{order.code}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`badge ${orderStatusTone[order.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                      {orderStatusLabel[order.status] || order.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatBRL(order.totalCents)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
