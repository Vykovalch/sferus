import type { Metadata } from 'next'
import { AuthBrand } from '@/components/auth/AuthBrand'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Регистрация — Sferus',
}

export default function RegisterPage() {
  return (
    <>
      <AuthBrand />
      <RegisterForm />
    </>
  )
}
