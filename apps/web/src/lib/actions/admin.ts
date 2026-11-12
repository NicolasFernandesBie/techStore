'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch } from '../api'
import { getToken } from '../session'
import type { ActionResult } from '../types'

function parseProductForm(formData: FormData) {
  const toCents = (value: FormDataEntryValue | null) => {
    const raw = String(value || '').trim().replace(',', '.')
    if (!raw) return 0
    return Math.round(Number(raw) * 100)
  }

  const compareRaw = String(formData.get('compareAt') || '').trim()

  return {
    name: String(formData.get('name') || '').trim(),
    slug: String(formData.get('slug') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    brand: String(formData.get('brand') || '').trim(),
    imageUrl: String(formData.get('imageUrl') || '').trim(),
    priceCents: toCents(formData.get('price')),
    compareAtCents: compareRaw ? toCents(formData.get('compareAt')) : null,
    stock: Number(formData.get('stock') || 0),
    featured: formData.get('featured') === 'on',
    categoryId: String(formData.get('categoryId') || ''),
    specs: String(formData.get('specs') || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  }
}

function requireToken(): { token?: string; error?: string } {
  const token = getToken()
  if (!token) return { error: 'Sessão expirada. Faça login novamente.' }
  return { token }
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  const { token, error } = requireToken()
  if (!token) return { ok: false, error }

  try {
    const product = await apiFetch<{ id: string }>('/api/v1/admin/products', {
      method: 'POST',
      token,
      body: parseProductForm(formData),
    })
    revalidatePath('/admin/produtos')
    revalidatePath('/produtos')
    revalidatePath('/')
    return { ok: true, redirectTo: `/admin/produtos/${product.id}` }
  } catch (actionError) {
    return { ok: false, error: (actionError as Error).message }
  }
}

export async function updateProductAction(id: string, formData: FormData): Promise<ActionResult> {
  const { token, error } = requireToken()
  if (!token) return { ok: false, error }

  try {
    await apiFetch(`/api/v1/admin/products/${id}`, {
      method: 'PATCH',
      token,
      body: parseProductForm(formData),
    })
    revalidatePath('/admin/produtos')
    revalidatePath(`/admin/produtos/${id}`)
    revalidatePath('/produtos')
    revalidatePath('/')
    return { ok: true }
  } catch (actionError) {
    return { ok: false, error: (actionError as Error).message }
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const { token, error } = requireToken()
  if (!token) return { ok: false, error }

  try {
    await apiFetch(`/api/v1/admin/products/${id}`, { method: 'DELETE', token })
    revalidatePath('/admin/produtos')
    revalidatePath('/produtos')
    revalidatePath('/')
    return { ok: true }
  } catch (actionError) {
    return { ok: false, error: (actionError as Error).message }
  }
}

export async function updateOrderStatusAction(id: string, status: string): Promise<ActionResult> {
  const { token, error } = requireToken()
  if (!token) return { ok: false, error }

  try {
    await apiFetch(`/api/v1/admin/orders/${id}/status`, {
      method: 'PATCH',
      token,
      body: { status },
    })
    revalidatePath('/admin/pedidos')
    revalidatePath('/admin')
    return { ok: true }
  } catch (actionError) {
    return { ok: false, error: (actionError as Error).message }
  }
}
