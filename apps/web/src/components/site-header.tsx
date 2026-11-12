'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LayoutDashboard, LogOut, Search, ShoppingCart, User as UserIcon } from 'lucide-react'
import clsx from 'clsx'
import { ThemeToggle } from '@/components/theme-toggle'
import { cartCount, useCartStore } from '@/lib/cart-store'
import { useHydrated } from '@/lib/use-hydrated'
import { logoutAction } from '@/lib/actions/auth'
import type { User } from '@/lib/types'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos?category=perifericos', label: 'Periféricos' },
  { href: '/produtos?category=hardware', label: 'Hardware' },
  { href: '/produtos?category=mesas-digitalizadoras', label: 'Mesas Digitalizadoras' },
]

export function SiteHeader({ user }: { user: User | null }) {
  const items = useCartStore((state) => state.items)
  const hydrated = useHydrated()
  const pathname = usePathname()
  const count = hydrated ? cartCount(items) : 0
  const headerRef = useRef<HTMLElement | null>(null)
  const [overHero, setOverHero] = useState(pathname === '/')
  const transparent = pathname === '/' && overHero

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    function update() {
      if (pathname !== '/') {
        setOverHero(false)
        return
      }

      const hero = document.getElementById('hero')
      if (!hero) {
        setOverHero(false)
        return
      }

      setOverHero(hero.getBoundingClientRect().bottom > (headerRef.current?.offsetHeight ?? 64))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

  return (
    <header
      ref={headerRef}
      className={clsx(
        'sticky top-0 z-40 border-b transition-colors duration-300',
        transparent
          ? 'border-transparent bg-transparent'
          : 'border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90',
      )}
    >
      <div className="container-page flex h-16 items-center gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span
            className={clsx(
              'text-lg font-bold tracking-tight',
              transparent ? 'text-white' : 'text-slate-900 dark:text-white',
            )}
          >
            TechStore
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'rounded-lg px-3 py-2 text-sm font-medium transition',
                pathname === link.href
                  ? transparent
                    ? 'bg-white/10 text-white'
                    : 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : transparent
                    ? 'text-white/75 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form action="/produtos" className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search
              className={clsx(
                'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
                transparent ? 'text-white/60' : 'text-slate-400 dark:text-slate-500',
              )}
            />
            <input
              name="q"
              placeholder="Buscar produtos..."
              className={clsx(
                'input pl-9',
                transparent &&
                  '!border-white/20 !bg-white/10 !text-white placeholder:!text-white/60 focus:!border-white/40 focus:!ring-white/20',
              )}
              aria-label="Buscar produtos"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={clsx(
                'btn-outline hidden sm:inline-flex',
                transparent &&
                  '!border-white/25 !bg-white/10 !text-white hover:!bg-white/20',
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-1">
              <Link
                href="/conta"
                className={clsx(
                  'hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition sm:flex',
                  transparent
                    ? 'text-white/80 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                )}
              >
                <UserIcon className="h-4 w-4" />
                {user.name.split(' ')[0]}
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className={clsx(
                    'rounded-lg p-2 transition',
                    transparent
                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                  )}
                  title="Sair"
                  aria-label="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className={clsx(
                'btn-outline',
                transparent &&
                  '!border-white/25 !bg-white/10 !text-white hover:!bg-white/20',
              )}
            >
              Entrar
            </Link>
          )}

          <ThemeToggle transparent={transparent} />

          <Link
            href="/carrinho"
            className={clsx(
              'relative rounded-lg p-2 transition',
              transparent
                ? 'text-white/80 hover:bg-white/10 hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
            )}
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="container-page flex gap-2 overflow-x-auto pb-2 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              'whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition',
              transparent
                ? 'text-white/75 hover:bg-white/10 hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
