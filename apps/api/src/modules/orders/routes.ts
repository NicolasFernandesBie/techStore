import type { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError, parseBody, sendError } from '../../lib/http'
import { currentUser, requireAuth } from '../../lib/auth'
import { createOrder } from './order.service'

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Informe o nome'),
  customerEmail: z.string().email('E-mail inválido'),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(3, 'Informe o endereço'),
  shippingCity: z.string().min(2, 'Informe a cidade'),
  shippingState: z.string().length(2, 'Use a sigla do estado'),
  shippingZip: z.string().min(8, 'Informe o CEP'),
  shippingMethod: z.string().min(1, 'Selecione o frete'),
  paymentMethod: z.enum(['PIX', 'CARD', 'BOLETO']),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, 'Carrinho vazio'),
})

async function optionalUserId(request: FastifyRequest): Promise<string | undefined> {
  const header = request.headers.authorization
  if (!header?.startsWith('Bearer ')) return undefined
  try {
    const payload = (await request.jwtVerify()) as { sub?: string }
    return payload.sub
  } catch {
    return undefined
  }
}

export async function orderRoutes(app: FastifyInstance) {
  app.post('/orders', async (request, reply) => {
    try {
      const data = parseBody(createOrderSchema, request.body)
      const userId = await optionalUserId(request)
      const order = await createOrder(data, userId)
      return reply.code(201).send(order)
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/orders/code/:code', async (request, reply) => {
    try {
      const { code } = request.params as { code: string }
      const order = await prisma.order.findUnique({
        where: { code: code.toUpperCase() },
        include: { items: true },
      })
      if (!order) throw new AppError('Pedido não encontrado', 404)
      return order
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/orders/mine', { preHandler: requireAuth }, async (request, reply) => {
    try {
      const user = currentUser(request)
      const orders = await prisma.order.findMany({
        where: { userId: user.sub },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      })
      return { orders }
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/orders/:id', { preHandler: requireAuth }, async (request, reply) => {
    try {
      const user = currentUser(request)
      const { id } = request.params as { id: string }
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      })
      if (!order) throw new AppError('Pedido não encontrado', 404)
      if (order.userId !== user.sub && user.role !== 'ADMIN') {
        throw new AppError('Acesso negado', 403)
      }
      return order
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
