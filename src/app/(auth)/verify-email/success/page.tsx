import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { AuthBrand } from '@/components/auth/AuthBrand'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Email подтверждён — Sferus',
}

// Better-auth редиректит сюда после успешного подтверждения
// если в auth.ts указать callbackURL: '/verify-email/success'
export default function VerifyEmailSuccessPage() {
  return (
    <>
      <AuthBrand />
      <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 bg-background w-full">
        <div className="w-full max-w-[400px] mx-auto text-center animate-in fade-in duration-300">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo className="h-9 w-auto" />
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <h2 className="text-2xl font-medium tracking-tight mb-2">Email подтверждён!</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Ваш аккаунт активирован. Теперь вы можете войти и пользоваться всеми
            возможностями платформы.
          </p>

          <Button
            asChild
            className="w-full bg-brand hover:bg-brand/90 text-brand-foreground h-10 font-medium cursor-pointer"
          >
            <Link href="/login">Войти в аккаунт</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
