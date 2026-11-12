import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/checkout-form'

export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return (
    <div className="container-page py-8">
      <nav className="text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-300">Início</Link>
        <span className="mx-1">/</span>
        <Link href="/carrinho" className="hover:text-brand-600 dark:hover:text-brand-300">Carrinho</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700 dark:text-slate-200">Checkout</span>
      </nav>
      <div className="mt-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Finalizar compra</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Informe os dados de entrega e escolha o pagamento. Tudo é simulado neste projeto.
        </p>
      </div>
      <div className="mt-6">
        <CheckoutForm />
      </div>
    </div>
  )
}
