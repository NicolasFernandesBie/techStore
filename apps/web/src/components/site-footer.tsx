import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">TechStore</span>
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Loja especializada em periféricos, hardware e equipamentos para criadores.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Loja</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link href="/produtos" className="hover:text-brand-600 dark:hover:text-brand-300">Todos os produtos</Link></li>
            <li><Link href="/produtos?category=perifericos" className="hover:text-brand-600 dark:hover:text-brand-300">Periféricos</Link></li>
            <li><Link href="/produtos?category=hardware" className="hover:text-brand-600 dark:hover:text-brand-300">Hardware</Link></li>
            <li><Link href="/produtos?category=mesas-digitalizadoras" className="hover:text-brand-600 dark:hover:text-brand-300">Mesas Digitalizadoras</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Conta</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link href="/login" className="hover:text-brand-600 dark:hover:text-brand-300">Entrar</Link></li>
            <li><Link href="/cadastro" className="hover:text-brand-600 dark:hover:text-brand-300">Criar conta</Link></li>
            <li><Link href="/conta" className="hover:text-brand-600 dark:hover:text-brand-300">Meus pedidos</Link></li>
            <li><Link href="/carrinho" className="hover:text-brand-600 dark:hover:text-brand-300">Carrinho</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Atendimento</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>Seg. a sex., 9h às 18h</li>
            <li>contato@techstore.com</li>
            <li>(11) 4000-0000</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 py-4">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500 sm:flex-row">
          <p>TechStore - Projeto acadêmico. Pagamentos e fretes são simulados.</p>
          <p>Next.js + Fastify + SQLite</p>
        </div>
      </div>
    </footer>
  )
}
