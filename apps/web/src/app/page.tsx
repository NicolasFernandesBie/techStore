import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { ProductCard } from '@/components/product-card'
import { HeroCarousel } from '@/components/hero-carousel'
import type { Category, ProductListResponse } from '@/lib/types'

export default async function HomePage() {
  let products: ProductListResponse = { items: [], total: 0, page: 1, perPage: 8 }
  let categories: Category[] = []
  let failed = false

  try {
    const [productData, categoryData] = await Promise.all([
      apiFetch<ProductListResponse>('/api/v1/products?perPage=8&sort=relevance'),
      apiFetch<Category[]>('/api/v1/categories'),
    ])
    products = productData
    categories = categoryData
  } catch {
    failed = true
  }

  return (
    <div>
      <HeroCarousel />

      <section className="container-page py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Categorias</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Encontre rapidamente o que você precisa.</p>
          </div>
          <Link href="/produtos" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
            Ver tudo
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/produtos?category=${category.slug}`}
              className="card group flex items-center justify-between gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{category.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{category.productCount ?? 0} produtos</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 transition group-hover:bg-brand-600 group-hover:text-white">
                <Package className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Destaques da semana</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Seleção especial da nossa curadoria.</p>
          </div>
          <Link href="/produtos" className="btn-outline">
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {failed ? (
          <div className="card mt-6 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Não foi possível carregar os produtos agora. Verifique se a API está no ar.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
