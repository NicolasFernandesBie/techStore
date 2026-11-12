import type { FastifyInstance } from 'fastify'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError, parseBody, sendError } from '../../lib/http'
import { serializeProduct } from '../../lib/serialize'

const listQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  sort: z.enum(['relevance', 'price-asc', 'price-desc', 'name']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(48).default(12),
})

export async function productRoutes(app: FastifyInstance) {
  app.get('/categories', async (_request, reply) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true } } },
      })
      return categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
        productCount: category._count.products,
      }))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/products', async (request, reply) => {
    try {
      const query = parseBody(listQuerySchema, request.query)
      const page = query.page ?? 1
      const perPage = query.perPage ?? 12
      const where: Prisma.ProductWhereInput = {}

      if (query.q) {
        where.OR = [
          { name: { contains: query.q } },
          { brand: { contains: query.q } },
          { description: { contains: query.q } },
        ]
      }
      if (query.category) {
        where.category = { slug: query.category }
      }

      let orderBy: Prisma.ProductOrderByWithRelationInput[] = [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ]
      if (query.sort === 'price-asc') orderBy = [{ priceCents: 'asc' }]
      if (query.sort === 'price-desc') orderBy = [{ priceCents: 'desc' }]
      if (query.sort === 'name') orderBy = [{ name: 'asc' }]

      const [items, total] = await prisma.$transaction([
        prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.product.count({ where }),
      ])

      return {
        items: items.map(serializeProduct),
        total,
        page,
        perPage,
      }
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/products/:slug', async (request, reply) => {
    try {
      const { slug } = request.params as { slug: string }
      const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      })
      if (!product) throw new AppError('Produto não encontrado', 404)

      return {
        ...serializeProduct(product),
        category: {
          id: product.category.id,
          slug: product.category.slug,
          name: product.category.name,
        },
      }
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
