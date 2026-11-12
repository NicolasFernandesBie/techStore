'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Loader2, LogIn } from 'lucide-react'
import { loginAction } from '@/lib/actions/auth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    const result = await loginAction(new FormData(event.currentTarget))
    if (!result.ok) {
      setError(result.error || 'Não foi possível entrar.')
      setPending(false)
      return
    }
    window.location.href = result.redirectTo || '/'
  }

  return (
    <div className="card p-6">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Entrar na conta</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Acesse para acompanhar pedidos e finalizar compras.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@email.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 dark:bg-red-500/10 p-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}

        <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Entrar
        </button>
      </form>

      <div className="mt-5 rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-600 dark:text-slate-300">Credenciais de demonstração</p>
        <div className="mt-2 space-y-1">
          <button
            type="button"
            className="block w-full text-left hover:text-brand-600 dark:hover:text-brand-300"
            onClick={() => {
              setEmail('admin@techstore.com')
              setPassword('admin123')
            }}
          >
            Admin: admin@techstore.com / admin123
          </button>
          <button
            type="button"
            className="block w-full text-left hover:text-brand-600 dark:hover:text-brand-300"
            onClick={() => {
              setEmail('cliente@techstore.com')
              setPassword('cliente123')
            }}
          >
            Cliente: cliente@techstore.com / cliente123
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Não tem conta?{' '}
        <Link href="/cadastro" className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}
