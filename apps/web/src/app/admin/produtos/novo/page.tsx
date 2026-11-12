import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { ProductForm } from '@/components/admin/product-form'
import type { Category } from '@/lib/types'

export default async function NewProductPage() {
  let categories: Category[] = []
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Novo produto</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Cadastre um item no catálogo da loja.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
