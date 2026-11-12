import type { FastifyReply } from 'fastify'
import { ZodError, type ZodSchema } from 'zod'

export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}

export function parseBody<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join('; ')
    throw new AppError(message, 400)
  }
  return result.data
}

export function sendError(reply: FastifyReply, error: unknown) {
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({ error: error.message })
  }
  if (error instanceof ZodError) {
    return reply.code(400).send({ error: error.message })
  }
  const prismaCode = (error as { code?: string })?.code
  if (prismaCode === 'P2003') {
    return reply.code(409).send({ error: 'Registro possui vínculos e não pode ser removido' })
  }
  console.error(error)
  return reply.code(500).send({ error: 'Erro interno do servidor' })
}
