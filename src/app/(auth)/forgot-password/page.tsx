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
      <ForgotPasswordForm />
    </>
  )
}
