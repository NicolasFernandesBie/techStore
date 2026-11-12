'use client'

import { useState } from 'react'
import { updateOrderStatusAction } from '@/lib/actions/admin'
import { orderStatusLabel, orderStatuses } from '@/lib/status'

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = useState(status)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(value: string) {
    const previous = current
    setCurrent(value)
    setPending(true)
    setError(null)

    const result = await updateOrderStatusAction(id, value)
    setPending(false)

    if (!result.ok) {
      setCurrent(previous)
      setError(result.error || 'Erro ao atualizar')
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={current}
        disabled={pending}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-brand-500 disabled:opacity-60"
      >
        {orderStatuses.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {orderStatusLabel[statusOption]}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] text-red-600 dark:text-red-400">{error}</span>}
    </div>
  )
}
