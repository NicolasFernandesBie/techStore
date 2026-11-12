'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Loader2, UserPlus } from 'lucide-react'
import { registerAction } from '@/lib/actions/auth'

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const result = await registerAction(new FormData(event.currentTarget))
    if (!result.ok) {
      setError(result.error || 'Não foi possível criar a conta.')
      setPending(false)
      return
    }
    window.location.href = result.redirectTo || '/'
  }

  return (
    <div className="card p-6">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Criar conta</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Cadastre-se para finalizar compras com mais agilidade.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="name">Nome completo</label>
          <input id="name" name="name" required className="input" placeholder="Seu nome" />
        </div>
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" required className="input" placeholder="voce@email.com" />
        </div>
        <div>
          <label className="label" htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="input"
            placeholder="Mínimo de 6 caracteres"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 dark:bg-red-500/10 p-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}

        <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Criar conta
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Já tem conta?{' '}
        <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
          Entrar
        </Link>
      </p>
    </div>
  )
}
