import type { FastifyReply, FastifyRequest } from 'fastify'

export type AuthUser = {
  sub: string
  role: string
  email: string
  name: string
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.code(401).send({ error: 'Não autenticado' })
  }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.code(401).send({ error: 'Não autenticado' })
  }
  const user = request.user as AuthUser
  if (user.role !== 'ADMIN') {
    return reply.code(403).send({ error: 'Acesso restrito ao administrador' })
  }
}

export function currentUser(request: FastifyRequest): AuthUser {
  return request.user as AuthUser
}
