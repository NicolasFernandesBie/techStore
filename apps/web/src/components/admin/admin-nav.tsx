'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, LayoutDashboard, LogOut, Package, Store } from 'lucide-react'
import clsx from 'clsx'
import { logoutAction } from '@/lib/actions/auth'
import type { User } from '@/lib/types'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/produtos', label: 'Produtos', icon: Package, exact: false },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList, exact: false },
]

export function AdminNav({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Administração</p>
        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
      </div>

      <nav className="card overflow-hidden p-2">
        {links.map((link) => {
          const Icon = link.icon
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
                active
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="card p-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <Store className="h-4 w-4" />
          Ver loja
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </div>
  )
}
