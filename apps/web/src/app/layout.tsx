import type { Metadata } from 'next'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getCurrentUser } from '@/lib/session'
import { THEME_STORAGE_KEY } from '@/lib/theme'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'TechStore | Periféricos, Hardware e Criatividade',
    template: '%s | TechStore',
  },
  description:
    'Loja especializada em periféricos gamer, hardware de alta performance e mesas digitalizadoras.',
}

const themeScript = `(() => {
  try {
    const stored = localStorage.getItem('${THEME_STORAGE_KEY}')
    const dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  } catch {}
})()`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null)

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteHeader user={user} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
