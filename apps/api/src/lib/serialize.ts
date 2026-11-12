import type { Product } from '@prisma/client'

export type ProductDTO = Omit<Product, 'specs'> & { specs: string[] }

export function parseSpecs(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function serializeProduct(product: Product): ProductDTO {
  return { ...product, specs: parseSpecs(product.specs) }
}
