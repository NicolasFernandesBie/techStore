import type { Metadata } from 'next'
import { LoginForm } from '@/components/login-form'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  return (
    <div className="container-page flex justify-center py-12">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
