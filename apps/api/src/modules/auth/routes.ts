import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError, parseBody, sendError } from '../../lib/http'
import { currentUser, requireAuth } from '../../lib/auth'

const registerSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres'),
})

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

function publicUser(user: { id: string; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    try {
      const data = parseBody(registerSchema, request.body)
      const existing = await prisma.user.findUnique({ where: { email: data.email } })
      if (existing) throw new AppError('E-mail já cadastrado', 409)

      const passwordHash = await bcrypt.hash(data.password, 10)
      const user = await prisma.user.create({
        data: { name: data.name, email: data.email, passwordHash, role: 'CUSTOMER' },
      })
      const token = app.jwt.sign(
        { sub: user.id, role: user.role, email: user.email, name: user.name },
        { expiresIn: '7d' },
      )
      return reply.code(201).send({ token, user: publicUser(user) })
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.post('/login', async (request, reply) => {
    try {
      const data = parseBody(loginSchema, request.body)
      const user = await prisma.user.findUnique({ where: { email: data.email } })
      if (!user) throw new AppError('Credenciais inválidas', 401)

      const valid = await bcrypt.compare(data.password, user.passwordHash)
      if (!valid) throw new AppError('Credenciais inválidas', 401)

      const token = app.jwt.sign(
        { sub: user.id, role: user.role, email: user.email, name: user.name },
        { expiresIn: '7d' },
      )
      return { token, user: publicUser(user) }
    } catch (error) {
      return sendError(reply, error)
    }
  })

  app.get('/me', { preHandler: requireAuth }, async (request, reply) => {
    try {
      const session = currentUser(request)
      const user = await prisma.user.findUnique({ where: { id: session.sub } })
      if (!user) throw new AppError('Usuário não encontrado', 404)
      return { user: publicUser(user) }
    } catch (error) {
      return sendError(reply, error)
    }
  })
}
