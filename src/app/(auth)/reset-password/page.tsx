import type { Metadata } from 'next'
import { AuthBrand } from '@/components/auth/AuthBrand'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Новый пароль — Sferus',
}

// better-auth добавляет ?token=... к URL в письме
// Передаём token в клиентский компонент
export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  return (
    <>
      <AuthBrand />
      <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 bg-background w-full">
        <div className="w-full max-w-[400px] mx-auto">
          <ResetPasswordForm token={searchParams.token} />
        </div>
      </div>
    </>
  )
}
