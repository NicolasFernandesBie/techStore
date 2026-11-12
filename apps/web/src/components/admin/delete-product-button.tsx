'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { deleteProductAction } from '@/lib/actions/admin'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    const confirmed = window.confirm(`Remover o produto "${name}"?`)
    if (!confirmed) return

    setPending(true)
    setError(null)
    const result = await deleteProductAction(id)
    setPending(false)

    if (!result.ok) {
      setError(result.error || 'Não foi possível remover.')
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 transition hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
        title="Remover produto"
        aria-label="Remover produto"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
      {error && <span className="mt-1 text-[10px] text-red-600 dark:text-red-400">{error}</span>}
    </div>
  )
}
