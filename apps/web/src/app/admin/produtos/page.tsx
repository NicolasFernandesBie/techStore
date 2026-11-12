import Image from 'next/image'
import Link from 'next/link'
import { Pencil, Plus, Search } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { getToken } from '@/lib/session'
import { formatBRL } from '@/lib/format'
import { DeleteProductButton } from '@/components/admin/delete-product-button'
import type { Product } from '@/lib/types'

type SearchParams = { q?: string }

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const q = searchParams.q?.trim() || ''
  const token = getToken()

  let items: Product[] = []
  let failed = false

  try {
    const data = await apiFetch<{ items: Product[] }>(
      `/api/v1/admin/products${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      { token },
    )
    items = data.items
  } catch {
    failed = true
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Produtos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{items.length} produto(s) cadastrado(s)</p>
        </div>
        <Link href="/admin/produtos/novo" className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo produto
        </Link>
      </div>

      <form action="/admin/produtos" className="card flex gap-2 p-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar produto"
            className="input pl-9"
            aria-label="Buscar produto"
          />
        </div>
        <button type="submit" className="btn-outline">Buscar</button>
      </form>

      {failed ? (
        <div className="card p-8 text-center text-sm text-slate-500 dark:text-slate-400">Não foi possível carregar os produtos.</div>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500 dark:text-slate-400">Nenhum produto encontrado.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Preço</th>
                  <th className="px-4 py-3 font-medium">Estoque</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 rounded-md bg-slate-50 dark:bg-slate-800">
                          <Image src={product.imageUrl} alt={product.name} fill sizes="44px" className="object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-slate-800 dark:text-slate-100">{product.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{product.brand} · {product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{product.category?.name ?? '-'}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{formatBRL(product.priceCents)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          product.stock === 0
                            ? 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300'
                            : product.stock <= 5
                              ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-300"
                          title="Editar produto"
                          aria-label="Editar produto"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
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
