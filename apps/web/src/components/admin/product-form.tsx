'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Loader2, Save } from 'lucide-react'
import { createProductAction, updateProductAction } from '@/lib/actions/admin'
import { productImages } from '@/lib/product-images'
import type { Category, Product } from '@/lib/types'

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[]
  product?: Product
}) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || productImages[0].url)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    setSaved(false)

    const formData = new FormData(event.currentTarget)
    const result = product
      ? await updateProductAction(product.id, formData)
      : await createProductAction(formData)

    if (!result.ok) {
      setError(result.error || 'Não foi possível salvar o produto.')
      setPending(false)
      return
    }

    if (result.redirectTo) {
      window.location.href = result.redirectTo
      return
    }

    setSaved(true)
    setPending(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <section className="card p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Informações do produto</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Nome</label>
              <input id="name" name="name" required defaultValue={product?.name} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="slug">
                Slug (URL) <span className="font-normal text-slate-400 dark:text-slate-500">ex.: rtx-4070</span>
              </label>
              <input
                id="slug"
                name="slug"
                required
                defaultValue={product?.slug}
                className="input"
                placeholder="nome-do-produto"
              />
            </div>
            <div>
              <label className="label" htmlFor="brand">Marca</label>
              <input id="brand" name="brand" required defaultValue={product?.brand} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                defaultValue={product?.description}
                className="input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="specs">
                Especificações <span className="font-normal text-slate-400 dark:text-slate-500">uma por linha</span>
              </label>
              <textarea
                id="specs"
                name="specs"
                rows={5}
                defaultValue={product?.specs.join('\n')}
                className="input"
                placeholder={'8GB GDDR6\nPCIe 4.0\nRay Tracing'}
              />
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Preço e estoque</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="price">Preço (R$)</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                required
                defaultValue={product ? (product.priceCents / 100).toFixed(2) : ''}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="compareAt">Preço antigo (R$)</label>
              <input
                id="compareAt"
                name="compareAt"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.compareAtCents ? (product.compareAtCents / 100).toFixed(2) : ''}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="stock">Estoque</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={product?.stock ?? 0}
                className="input"
              />
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="card p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Organização</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label" htmlFor="categoryId">Categoria</label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={product?.categoryId}
                className="input"
              >
                <option value="">Selecione...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 dark:text-brand-400"
              />
              Destacar na página inicial
            </label>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Imagem</h2>
          <div className="relative mt-3 aspect-square overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800">
            <Image src={imageUrl} alt="Prévia" fill sizes="280px" className="object-contain p-4" />
          </div>
          <div className="mt-3">
            <label className="label" htmlFor="imageUrl">Arquivo</label>
            <select
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="input"
            >
              {productImages.map((image) => (
                <option key={image.url} value={image.url}>
                  {image.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="space-y-2">
          {error && <p className="rounded-lg bg-red-50 dark:bg-red-500/10 p-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
          {saved && <p className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 p-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">Produto salvo com sucesso.</p>}

          <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {product ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
        </div>
      </aside>
    </form>
  )
}
