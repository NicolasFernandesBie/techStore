import Link from 'next/link'
import type { Metadata } from 'next'
import { SlidersHorizontal } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { ProductCard } from '@/components/product-card'
import type { Category, ProductListResponse } from '@/lib/types'

export const metadata: Metadata = { title: 'Produtos' }

type SearchParams = {
  q?: string
  category?: string
  sort?: string
  page?: string
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const q = searchParams.q?.trim() || ''
  const category = searchParams.category || ''
  const sort = searchParams.sort || 'relevance'
  const page = Math.max(1, Number(searchParams.page) || 1)

  const apiParams = new URLSearchParams()
  if (q) apiParams.set('q', q)
  if (category) apiParams.set('category', category)
  if (sort) apiParams.set('sort', sort)
  apiParams.set('page', String(page))
  apiParams.set('perPage', '12')

  let data: ProductListResponse = { items: [], total: 0, page, perPage: 12 }
  let categories: Category[] = []
  let failed = false

  try {
    const [productData, categoryData] = await Promise.all([
      apiFetch<ProductListResponse>(`/api/v1/products?${apiParams.toString()}`),
      apiFetch<Category[]>('/api/v1/categories'),
    ])
    data = productData
    categories = categoryData
  } catch {
    failed = true
  }

  const activeCategory = categories.find((item) => item.slug === category)
  const totalPages = Math.max(1, Math.ceil(data.total / data.perPage))

  function buildHref(overrides: Partial<SearchParams>) {
    const params = new URLSearchParams()
    const nextQ = overrides.q ?? q
    const nextCategory = overrides.category ?? category
    const nextSort = overrides.sort ?? sort
    const nextPage = overrides.page ?? '1'
    if (nextQ) params.set('q', nextQ)
    if (nextCategory) params.set('category', nextCategory)
    if (nextSort && nextSort !== 'relevance') params.set('sort', nextSort)
    if (nextPage && nextPage !== '1') params.set('page', nextPage)
    const query = params.toString()
    return query ? `/produtos?${query}` : '/produtos'
  }

  return (
    <div className="container-page py-8">
      <nav className="text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-300">Início</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-700 dark:text-slate-200">Produtos</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {activeCategory ? activeCategory.name : 'Todos os produtos'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {failed ? 'Não foi possível carregar o catálogo.' : `${data.total} produto(s) encontrado(s)`}
          </p>
        </div>
      </div>

      <form action="/produtos" className="card mt-6 grid gap-3 p-4 sm:grid-cols-[1fr_200px_200px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou marca"
          className="input"
          aria-label="Buscar"
        />
        <select name="category" defaultValue={category} className="input" aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="input" aria-label="Ordenar">
          <option value="relevance">Mais relevantes</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="name">Nome (A-Z)</option>
        </select>
        <button type="submit" className="btn-primary">
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar
        </button>
      </form>

      {(q || category) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Filtros ativos:</span>
          {q && <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">Busca: {q}</span>}
          {activeCategory && <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">{activeCategory.name}</span>}
          <Link href="/produtos" className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
            Limpar
          </Link>
        </div>
      )}

      {failed ? (
        <div className="card mt-6 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          A API não respondeu. Tente novamente em instantes.
        </div>
      ) : data.items.length === 0 ? (
        <div className="card mt-6 p-12 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Nenhum produto encontrado.</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ajuste a busca ou remova os filtros.</p>
          <Link href="/produtos" className="btn-outline mt-4">Ver todos os produtos</Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={buildHref({ page: String(page - 1) })} className="btn-outline">
                  Anterior
                </Link>
              )}
              <span className="px-3 text-sm text-slate-500 dark:text-slate-400">
                Página {page} de {totalPages}
              </span>
              {page < totalPages && (
                <Link href={buildHref({ page: String(page + 1) })} className="btn-outline">
                  Próxima
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
