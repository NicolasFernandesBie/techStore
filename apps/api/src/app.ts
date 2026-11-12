import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { AppError } from './lib/http'
import { authRoutes } from './modules/auth/routes'
import { productRoutes } from './modules/products/routes'
import { shippingRoutes } from './modules/shipping/routes'
import { orderRoutes } from './modules/orders/routes'
import { adminRoutes } from './modules/admin/routes'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  })

  const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())

  await app.register(cors, { origin: origins, credentials: true })
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'techstore-dev-secret-change-in-production',
  })

  app.get('/api/v1/health', async () => ({ status: 'ok', service: 'techstore-api' }))

  await app.register(authRoutes, { prefix: '/api/v1/auth' })
  await app.register(productRoutes, { prefix: '/api/v1' })
  await app.register(shippingRoutes, { prefix: '/api/v1' })
  await app.register(orderRoutes, { prefix: '/api/v1' })
  await app.register(adminRoutes, { prefix: '/api/v1/admin' })

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ error: error.message })
    }
    app.log.error(error)
    return reply.code(500).send({ error: 'Erro interno do servidor' })
  })

  return app
}
