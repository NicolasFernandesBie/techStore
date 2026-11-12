'use client'

import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import clsx from 'clsx'
import { THEME_STORAGE_KEY } from '@/lib/theme'

export function ThemeToggle({ transparent = false }: { transparent?: boolean }) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange(event: MediaQueryListEvent) {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return

      document.documentElement.classList.toggle('dark', event.matches)
      document.documentElement.style.colorScheme = event.matches ? 'dark' : 'light'
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  function toggleTheme() {
    const root = document.documentElement
    const next = !root.classList.contains('dark')

    root.classList.toggle('dark', next)
    root.style.colorScheme = next ? 'dark' : 'light'
    localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx(
        'rounded-lg p-2 transition',
        transparent
          ? 'text-white/80 hover:bg-white/10 hover:text-white'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
      )}
      title="Alternar tema"
      aria-label="Alternar tema claro e escuro"
    >
      <Sun className="hidden h-5 w-5 dark:block" />
      <Moon className="h-5 w-5 dark:hidden" />
    </button>
  )
}
