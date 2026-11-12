import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/admin-nav'
import { getCurrentUser } from '@/lib/session'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'ADMIN') redirect('/')

  return (
    <div className="container-page py-8">
      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <AdminNav user={user} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
