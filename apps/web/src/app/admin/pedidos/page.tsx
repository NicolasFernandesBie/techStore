import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { getToken } from '@/lib/session'
import { formatBRL, formatDate } from '@/lib/format'
import { orderStatusLabel, orderStatusTone, orderStatuses, paymentLabel } from '@/lib/status'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import type { Order } from '@/lib/types'

type SearchParams = { status?: string }

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const status = searchParams.status || ''
  const token = getToken()

  let orders: Order[] = []
  let failed = false

  try {
    const data = await apiFetch<{ orders: Order[] }>(
      `/api/v1/admin/orders${status ? `?status=${encodeURIComponent(status)}` : ''}`,
      { token },
    )
    orders = data.orders
  } catch {
    failed = true
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pedidos</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{orders.length} pedido(s) encontrado(s)</p>
      </div>

      <form action="/admin/pedidos" className="card flex flex-wrap items-end gap-3 p-3">
        <div>
          <label className="label" htmlFor="status">Filtrar por status</label>
          <select id="status" name="status" defaultValue={status} className="input min-w-48">
            <option value="">Todos</option>
            {orderStatuses.map((option) => (
              <option key={option} value={option}>{orderStatusLabel[option]}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-outline">Filtrar</button>
        {status && (
          <Link href="/admin/pedidos" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
            Limpar
          </Link>
        )}
      </form>

      {failed ? (
        <div className="card p-8 text-center text-sm text-slate-500 dark:text-slate-400">Não foi possível carregar os pedidos.</div>
      ) : orders.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500 dark:text-slate-400">Nenhum pedido encontrado.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Pedido</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Itens</th>
                  <th className="px-4 py-3 font-medium">Pagamento</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-3">
                      <Link href={`/pedido/${order.code}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-300">
                        {order.code}
                      </Link>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700 dark:text-slate-200">{order.customerName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-56 truncate text-xs text-slate-600 dark:text-slate-300">
                        {order.items.map((item) => `${item.quantity}x ${item.productName}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {paymentLabel[order.paymentMethod] || order.paymentMethod}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{formatBRL(order.totalCents)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <span className={`badge w-fit ${orderStatusTone[order.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                          {orderStatusLabel[order.status] || order.status}
                        </span>
                        <OrderStatusSelect id={order.id} status={order.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
