import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CreditCard, ShieldCheck, Truck } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { ProductActions } from '@/components/product-actions'
import { ProductCard } from '@/components/product-card'
import { formatBRL } from '@/lib/format'
import type { Product, ProductListResponse } from '@/lib/types'

type PageProps = { params: { slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const product = await apiFetch<Product>(`/api/v1/products/${params.slug}`)
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [product.imageUrl],
      },
    }
  } catch {
    return { title: 'Produto' }
  }
}

export default async function ProductPage({ params }: PageProps) {
  let fetched: Product | null = null
  try {
    fetched = await apiFetch<Product>(`/api/v1/products/${params.slug}`)
  } catch {
    fetched = null
  }
  if (!fetched) notFound()
  const product: Product = fetched

  let related: Product[] = []
  if (product.category) {
    try {
      const data = await apiFetch<ProductListResponse>(
        `/api/v1/products?category=${product.category.slug}&perPage=5`,
      )
      related = data.items.filter((item) => item.id !== product.id).slice(0, 4)
    } catch {
      related = []
    }
  }

  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
      : null

  return (
    <div className="container-page py-8">
      <nav className="text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-300">Início</Link>
        <span className="mx-1">/</span>
        <Link href="/produtos" className="hover:text-brand-600 dark:hover:text-brand-300">Produtos</Link>
        {product.category && (
          <>
            <span className="mx-1">/</span>
            <Link href={`/produtos?category=${product.category.slug}`} className="hover:text-brand-600 dark:hover:text-brand-300">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-1">/</span>
        <span className="text-slate-700 dark:text-slate-200">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="relative aspect-square bg-white dark:bg-slate-900">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
            />
            {discount !== null && (
              <span className="badge absolute left-4 top-4 bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                -{discount}% OFF
              </span>
            )}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            {product.brand}
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Categoria: {product.category?.name ?? '-'} · SKU: {product.slug}
          </p>

          <div className="mt-5">
            {product.compareAtCents && (
              <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                {formatBRL(product.compareAtCents)}
              </span>
            )}
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatBRL(product.priceCents)}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              ou 12x de {formatBRL(Math.ceil(product.priceCents / 12))} sem juros
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">10% de desconto no PIX (simulado)</p>
          </div>

          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            {product.stock > 0 ? (
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Em estoque ({product.stock} unidade{product.stock > 1 ? 's' : ''})
              </span>
            ) : (
              <span className="font-medium text-red-600 dark:text-red-400">Produto esgotado</span>
            )}
          </p>

          <div className="mt-5">
            <ProductActions product={product} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, title: 'Frete', text: 'Calculado no checkout' },
              { icon: CreditCard, title: 'Pagamento', text: 'PIX, cartão ou boleto' },
              { icon: ShieldCheck, title: 'Segurança', text: 'Ambiente simulado' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                  <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Descrição</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Especificações</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {product.specs.map((spec) => (
              <li key={spec} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {spec}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Você também pode gostar</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
