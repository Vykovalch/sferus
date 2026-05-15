import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Войти — Sferus',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {children}
    </div>
  )
}
