import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Package } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { getCurrentUser, getToken } from '@/lib/session'
import { formatBRL, formatDate } from '@/lib/format'
import { orderStatusLabel, orderStatusTone } from '@/lib/status'
import type { Order } from '@/lib/types'

export const metadata: Metadata = { title: 'Minha conta' }

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const token = getToken()
  let orders: Order[] = []
  let failed = false

  try {
    const data = await apiFetch<{ orders: Order[] }>('/api/v1/orders/mine', { token })
    orders = data.orders
  } catch {
    failed = true
  }

  return (
    <div className="container-page py-8">
      <nav className="text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-300">Início</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700 dark:text-slate-200">Minha conta</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Olá, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
        {user.role === 'ADMIN' && (
          <Link href="/admin" className="btn-outline">Ir para o painel admin</Link>
        )}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900 dark:text-white">Meus pedidos</h2>

      {failed ? (
        <div className="card mt-4 p-6 text-sm text-slate-500 dark:text-slate-400">
          Não foi possível carregar seus pedidos agora.
        </div>
      ) : orders.length === 0 ? (
        <div className="card mt-4 flex flex-col items-center gap-3 p-10 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <Package className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Você ainda não fez pedidos.</p>
          <Link href="/produtos" className="btn-primary">Explorar produtos</Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/pedido/${order.code}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-300">
                    {order.code}
                  </Link>
                  <span className={`badge ${orderStatusTone[order.status] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                    {orderStatusLabel[order.status] || order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(order.createdAt)} · {order.items.length} item(ns)
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatBRL(order.totalCents)}</span>
                <Link href={`/pedido/${order.code}`} className="btn-outline">Detalhes</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
