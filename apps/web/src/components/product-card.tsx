import Image from 'next/image'
import Link from 'next/link'
import { formatBRL } from '@/lib/format'
import type { Product } from '@/lib/types'

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
      : null

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-white dark:bg-slate-900">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-4 transition duration-300 group-hover:scale-105"
        />
        {discount !== null && (
          <span className="badge absolute left-3 top-3 bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="badge absolute right-3 top-3 bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300">Esgotado</span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="badge absolute right-3 top-3 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300">
            Últimas {product.stock}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 border-t border-slate-100 dark:border-slate-800 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          {product.brand}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{product.name}</h3>
        <div className="mt-auto pt-3">
          {product.compareAtCents && (
            <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
              {formatBRL(product.compareAtCents)}
            </span>
          )}
          <p className="text-lg font-bold text-slate-900 dark:text-white">{formatBRL(product.priceCents)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ou 12x de {formatBRL(Math.ceil(product.priceCents / 12))}
          </p>
        </div>
      </div>
    </Link>
  )
}
