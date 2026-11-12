import Link from 'next/link'
import type { Metadata } from 'next'
import { CartView } from '@/components/cart-view'

export const metadata: Metadata = { title: 'Carrinho' }

export default function CartPage() {
  return (
    <div className="container-page py-8">
      <nav className="text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-300">Início</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700 dark:text-slate-200">Carrinho</span>
      </nav>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Seu carrinho</h1>
      <div className="mt-6">
        <CartView />
      </div>
    </div>
  )
}
