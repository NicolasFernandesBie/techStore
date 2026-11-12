import type { Metadata } from 'next'
import { RegisterForm } from '@/components/register-form'

export const metadata: Metadata = { title: 'Criar conta' }

export default function RegisterPage() {
  return (
    <div className="container-page flex justify-center py-12">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
