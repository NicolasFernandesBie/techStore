'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Barcode, CreditCard, Loader2, MapPin, QrCode, ShieldCheck, Truck } from 'lucide-react'
import clsx from 'clsx'
import { cartSubtotalCents, useCartStore } from '@/lib/cart-store'
import { useHydrated } from '@/lib/use-hydrated'
import { formatBRL } from '@/lib/format'
import { placeOrderAction, quoteShippingAction } from '@/lib/actions/orders'
import type { ShippingOption } from '@/lib/types'

const ufs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

const paymentOptions = [
  { id: 'PIX' as const, label: 'PIX', description: 'Aprovação imediata (simulado)', icon: QrCode },
  { id: 'CARD' as const, label: 'Cartão de crédito', description: 'Em até 12x (simulado)', icon: CreditCard },
  { id: 'BOLETO' as const, label: 'Boleto', description: 'Vencimento em 3 dias (simulado)', icon: Barcode },
]

export function CheckoutForm() {
  const items = useCartStore((state) => state.items)
  const clear = useCartStore((state) => state.clear)
  const hydrated = useHydrated()

  const [zip, setZip] = useState('')
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[] | null>(null)
  const [selectedShipping, setSelectedShipping] = useState('')
  const [quotePending, setQuotePending] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARD' | 'BOLETO'>('PIX')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = cartSubtotalCents(items)
  const selectedOption = shippingOptions?.find((option) => option.id === selectedShipping)
  const total = subtotal + (selectedOption?.priceCents ?? 0)

  async function handleQuote() {
    setQuoteError(null)
    if (zip.replace(/\D/g, '').length < 8) {
      setQuoteError('Informe um CEP com 8 dígitos.')
      return
    }
    setQuotePending(true)
    const result = await quoteShippingAction(zip, subtotal)
    setQuotePending(false)
    if (!result.ok || !result.options) {
      setQuoteError(result.error || 'Não foi possível calcular o frete.')
      return
    }
    setShippingOptions(result.options)
    setSelectedShipping(result.options[0]?.id ?? '')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError('Seu carrinho está vazio.')
      return
    }
    if (!selectedShipping) {
      setError('Calcule e selecione uma opção de frete antes de finalizar.')
      return
    }

    const formData = new FormData(event.currentTarget)
    setPending(true)

    const result = await placeOrderAction({
      customerName: String(formData.get('customerName') || '').trim(),
      customerEmail: String(formData.get('customerEmail') || '').trim(),
      customerPhone: String(formData.get('customerPhone') || '').trim() || undefined,
      shippingAddress: String(formData.get('shippingAddress') || '').trim(),
      shippingCity: String(formData.get('shippingCity') || '').trim(),
      shippingState: String(formData.get('shippingState') || '').trim(),
      shippingZip: zip,
      shippingMethod: selectedShipping,
      paymentMethod,
      couponCode: String(formData.get('couponCode') || '').trim() || undefined,
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    })

    if (!result.ok || !result.code) {
      setError(result.error || 'Não foi possível concluir o pedido.')
      setPending(false)
      return
    }

    clear()
    window.location.href = `/pedido/${result.code}`
  }

  if (!hydrated) {
    return <div className="card p-10 text-center text-sm text-slate-500 dark:text-slate-400">Carregando checkout...</div>
  }

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 p-12 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
          <Truck className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Nada para finalizar</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Adicione produtos ao carrinho para continuar.</p>
        </div>
        <Link href="/produtos" className="btn-primary">
          Ver produtos
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">1</span>
            Contato
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="customerName">Nome completo</label>
              <input id="customerName" name="customerName" required className="input" placeholder="Seu nome" />
            </div>
            <div>
              <label className="label" htmlFor="customerEmail">E-mail</label>
              <input id="customerEmail" name="customerEmail" type="email" required className="input" placeholder="voce@email.com" />
            </div>
            <div>
              <label className="label" htmlFor="customerPhone">Telefone (opcional)</label>
              <input id="customerPhone" name="customerPhone" className="input" placeholder="(11) 99999-9999" />
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">2</span>
            Endereço de entrega
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="shippingZip">CEP</label>
              <div className="flex gap-2">
                <input
                  id="shippingZip"
                  name="shippingZip"
                  value={zip}
                  onChange={(event) => setZip(event.target.value)}
                  required
                  className="input"
                  placeholder="00000-000"
                />
                <button
                  type="button"
                  onClick={handleQuote}
                  disabled={quotePending}
                  className="btn-outline shrink-0"
                >
                  {quotePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  Calcular
                </button>
              </div>
              {quoteError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{quoteError}</p>}
            </div>
            <div>
              <label className="label" htmlFor="shippingAddress">Endereço</label>
              <input id="shippingAddress" name="shippingAddress" required className="input" placeholder="Rua, número e complemento" />
            </div>
            <div>
              <label className="label" htmlFor="shippingCity">Cidade</label>
              <input id="shippingCity" name="shippingCity" required className="input" placeholder="Cidade" />
            </div>
            <div>
              <label className="label" htmlFor="shippingState">Estado</label>
              <select id="shippingState" name="shippingState" required className="input" defaultValue="SP">
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          {shippingOptions && (
            <div className="mt-5 space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Opções de frete (simuladas)</p>
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className={clsx(
                    'flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 text-sm transition',
                    selectedShipping === option.id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingOption"
                      value={option.id}
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                      className="accent-brand-600"
                    />
                    <span>
                      <span className="block font-medium text-slate-800 dark:text-slate-100">{option.label}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{option.days}</span>
                    </span>
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {option.priceCents === 0 ? 'Grátis' : formatBRL(option.priceCents)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">3</span>
            Pagamento
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {paymentOptions.map((option) => {
              const Icon = option.icon
              return (
                <label
                  key={option.id}
                  className={clsx(
                    'cursor-pointer rounded-lg border p-3 text-sm transition',
                    paymentMethod === option.id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700',
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                    className="sr-only"
                  />
                  <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <span className="mt-2 block font-medium text-slate-800 dark:text-slate-100">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{option.description}</span>
                </label>
              )
            })}
          </div>

          <div className="mt-4">
            <label className="label" htmlFor="couponCode">Cupom de desconto (opcional)</label>
            <input id="couponCode" name="couponCode" className="input max-w-xs" placeholder="Ex.: BEMVINDO10" />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            Ambiente de simulação: nenhuma cobrança real é feita e nenhum dado de cartão é coletado.
          </div>
        </section>
      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        <div className="card p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Resumo do pedido</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-md bg-slate-50 dark:bg-slate-800">
                  <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-medium text-slate-700 dark:text-slate-200">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Qtd. {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {formatBRL(item.priceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <dt>Frete</dt>
              <dd>{selectedOption ? (selectedOption.priceCents === 0 ? 'Grátis' : formatBRL(selectedOption.priceCents)) : '-'}</dd>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <dt>Cupom</dt>
              <dd className="text-xs">aplicado ao finalizar</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-base font-bold text-slate-900 dark:text-white">
              <dt>Total</dt>
              <dd>{formatBRL(total)}</dd>
            </div>
          </dl>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 dark:bg-red-500/10 p-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
          )}

          <button type="submit" disabled={pending} className="btn-primary mt-4 w-full py-3">
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Finalizar pedido'
            )}
          </button>
          <Link href="/carrinho" className="btn-outline mt-2 w-full">
            Voltar ao carrinho
          </Link>
        </div>
      </aside>
    </form>
  )
}
