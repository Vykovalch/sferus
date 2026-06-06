import type { Metadata } from 'next'
import { AuthBrand } from '@/components/auth/AuthBrand'
import { VerifyEmailClient } from '@/components/auth/VerifyEmailClient'

export const metadata: Metadata = {
  title: 'Подтвердите email — Sferus',
}

// Страница получает email из searchParams чтобы показать его пользователю
// ?email=user@example.com передаётся из RegisterForm после успешной регистрации
export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  return (
    <>
      <AuthBrand />
      <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 bg-background w-full">
        <div className="w-full max-w-[400px] mx-auto">
          <VerifyEmailClient email={searchParams.email} />
        </div>
      </div>
    </>
  )
}
