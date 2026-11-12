import type { FastifyInstance } from 'fastify'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError, parseBody, sendError } from '../../lib/http'
import { requireAdmin } from '../../lib/auth'
import { parseSpecs } from '../../lib/serialize'

const productSchema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  slug: z
    .string()
    .min(2, 'Informe o slug')
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífen'),
  description: z.string().min(10, 'Descreva o produto'),
  brand: z.string().min(1, 'Informe a marca'),
  imageUrl: z.string().min(1, 'Selecione uma imagem'),
  priceCents: z.coerce.number().int().positive(),
  compareAtCents: z.coerce.number().int().positive().optional().nullable(),
  stock: z.coerce.number().int().nonnegative(),
  featured: z.boolean().optional(),
  categoryId: z.string().min(1, 'Selecione a categoria'),
  specs: z.array(z.string()).optional(),
})

const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED']),
})

type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>

function serializeAdminProduct(product: ProductWithCategory) {
  return { ...product, specs: parseSpecs(product.specs) }
}

export async function adminRoutes(app: FastifyInstance) {
  app.get('/stats', { preHandler: requireAdmin }, async (_request, reply) => {
    try {
      const paidStatuses = ['PAID', 'SHIPPED', 'DELIVERED']
      const [ordersCount, paidOrders, revenue, productsCount, lowStockCount, topProducts, recentOrders] =
        await Promise.all([
          prisma.order.count(),
          prisma.order.count({ where: { status: { in: paidStatuses } } }),
          prisma.order.aggregate({
            _sum: { totalCents: true },
            where: { status: { in: paidStatuses } },
          }),
          prisma.product.count(),
          prisma.product.count({ where: { stock: { lte: 5 } } }),
          prisma.orderItem.groupBy({
            by: ['productName'],
            _sum: { quantity: true, totalCents: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5,
          }),
          prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
        ])

      const revenueCents = revenue._sum.totalCents ?? 0

      return {
        revenueCents,
        ordersCount,
        paidOrders,
        productsCount,
        lowStockCount,
        averageTicketCents: paidOrders > 0 ? Math.round(revenueCents / paidOrders) : 0,
        topProducts: topProducts.map((item) => ({
          name: item.productName,
          quantity: item._sum.quantity ?? 0,
          totalCents: item._sum.totalCents ?? 0,
        })),
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          code: order.code,
          customerName: order.customerName,
          totalCents: order.totalCents,
          status: order.status,
          createdAt: order.createdAt,
        })),
      }
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/products', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const { q } = request.query as { q?: string }
      const items = await prisma.product.findMany({
        where: q ? { name: { contains: q } } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      })
      return { items: items.map(serializeAdminProduct) }
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/products/:id', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
      })
      if (!product) throw new AppError('Produto não encontrado', 404)
      return serializeAdminProduct(product)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.post('/products', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const data = parseBody(productSchema, request.body)
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
      if (!category) throw new AppError('Categoria inválida', 400)

      const slugExists = await prisma.product.findUnique({ where: { slug: data.slug } })
      if (slugExists) throw new AppError('Já existe um produto com este slug', 409)

      const product = await prisma.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          brand: data.brand,
          imageUrl: data.imageUrl,
          priceCents: data.priceCents,
          compareAtCents: data.compareAtCents ?? null,
          stock: data.stock,
          featured: data.featured ?? false,
          specs: JSON.stringify(data.specs ?? []),
          categoryId: data.categoryId,
        },
        include: { category: true },
      })
      return reply.code(201).send(serializeAdminProduct(product))
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.patch('/products/:id', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const existing = await prisma.product.findUnique({ where: { id } })
      if (!existing) throw new AppError('Produto não encontrado', 404)

      const data = parseBody(productSchema.partial(), request.body)

      if (data.slug && data.slug !== existing.slug) {
        const slugExists = await prisma.product.findUnique({ where: { slug: data.slug } })
        if (slugExists) throw new AppError('Já existe um produto com este slug', 409)
      }
      if (data.categoryId) {
        const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
        if (!category) throw new AppError('Categoria inválida', 400)
      }

      const updateData: Prisma.ProductUpdateInput = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.slug !== undefined) updateData.slug = data.slug
      if (data.description !== undefined) updateData.description = data.description
      if (data.brand !== undefined) updateData.brand = data.brand
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
      if (data.priceCents !== undefined) updateData.priceCents = data.priceCents
      if (data.compareAtCents !== undefined) updateData.compareAtCents = data.compareAtCents
      if (data.stock !== undefined) updateData.stock = data.stock
      if (data.featured !== undefined) updateData.featured = data.featured
      if (data.specs !== undefined) updateData.specs = JSON.stringify(data.specs)
      if (data.categoryId !== undefined) updateData.category = { connect: { id: data.categoryId } }

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: { category: true },
      })
      return serializeAdminProduct(product)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.delete('/products/:id', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const existing = await prisma.product.findUnique({ where: { id } })
      if (!existing) throw new AppError('Produto não encontrado', 404)
      await prisma.product.delete({ where: { id } })
      return { ok: true }
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/orders', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const { status } = request.query as { status?: string }
      const orders = await prisma.order.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      })
      return { orders }
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.patch('/orders/:id/status', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { status } = parseBody(orderStatusSchema, request.body)
      const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
      if (!order) throw new AppError('Pedido não encontrado', 404)

      const updated = await prisma.$transaction(async (tx) => {
        if (status === 'CANCELED' && order.status !== 'CANCELED') {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            })
          }
        }
        return tx.order.update({ where: { id }, data: { status }, include: { items: true } })
      })

      return updated
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
