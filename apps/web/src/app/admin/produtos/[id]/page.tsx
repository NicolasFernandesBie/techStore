import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { getToken } from '@/lib/session'
import { ProductForm } from '@/components/admin/product-form'
import type { Category, Product } from '@/lib/types'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const token = getToken()

  let fetched: Product | null = null
  let categories: Category[] = []

  try {
    fetched = await apiFetch<Product>(`/api/v1/admin/products/${params.id}`, { token })
  } catch {
    fetched = null
  }
  if (!fetched) notFound()

  try {
    categories = await apiFetch<Category[]>('/api/v1/categories')
  } catch {
    categories = []
  }

  return (
    <div className="space-y-5">
      <Link href="/admin/produtos" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300">
        <ArrowLeft className="h-4 w-4" />
        Voltar para produtos
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Editar produto</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{fetched.name}</p>
      </div>
      <ProductForm categories={categories} product={fetched} />
    </div>
  )
}
