import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { parseBody, sendError } from '../../lib/http'
import { shippingProvider } from './shipping.provider'

const quoteSchema = z.object({
  zip: z.string().min(8, 'Informe um CEP válido'),
  subtotalCents: z.number().int().nonnegative(),
})

export async function shippingRoutes(app: FastifyInstance) {
  app.post('/shipping/quote', async (request, reply) => {
    try {
      const data = parseBody(quoteSchema, request.body)
      const options = shippingProvider.quote({
        zip: data.zip,
        subtotalCents: data.subtotalCents,
      })
      return { options }
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
