import type { Metadata } from 'next'
import { VerifyEmailClient } from '@/components/auth/VerifyEmailClient'

export const metadata: Metadata = {
  title: 'Подтвердите email — Sferus',
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        <VerifyEmailClient email={searchParams.email} />
      </div>
    </div>
  )
}