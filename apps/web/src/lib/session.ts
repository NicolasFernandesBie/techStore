import { cookies } from 'next/headers'
import { apiFetch } from './api'
import type { User } from './types'

export const TOKEN_COOKIE = 'techstore_token'

export function getToken(): string | undefined {
  return cookies().get(TOKEN_COOKIE)?.value
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getToken()
  if (!token) return null
  try {
    const data = await apiFetch<{ user: User }>('/api/v1/auth/me', { token })
    return data.user
  } catch {
    return null
  }
}
