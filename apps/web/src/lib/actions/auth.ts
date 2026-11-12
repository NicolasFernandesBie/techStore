'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiFetch } from '../api'
import { TOKEN_COOKIE } from '../session'
import type { ActionResult, User } from '../types'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  try {
    const data = await apiFetch<{ token: string; user: User }>('/api/v1/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    cookies().set(TOKEN_COOKIE, data.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    })
    return { ok: true, redirectTo: data.user.role === 'ADMIN' ? '/admin' : '/' }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  try {
    const data = await apiFetch<{ token: string; user: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: { name, email, password },
    })
    cookies().set(TOKEN_COOKIE, data.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    })
    return { ok: true, redirectTo: '/' }
  } catch (error) {
    return { ok: false, error: (error as Error).message }
  }
}

export async function logoutAction() {
  cookies().delete(TOKEN_COOKIE)
  redirect('/')
}
