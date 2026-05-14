// src/app/(auth)/layout.tsx
import { AuthBrand } from '@/components/auth/AuthBrand'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <AuthBrand />
      <div className="flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  )
}