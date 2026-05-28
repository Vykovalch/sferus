import type { Metadata } from 'next'
import { AuthBrand } from '@/components/auth/AuthBrand'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Восстановление пароля — Sferus',
}

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthBrand />
      
      <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 bg-background w-full">
        <div className="w-full max-w-[400px] mx-auto">
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  )
}
