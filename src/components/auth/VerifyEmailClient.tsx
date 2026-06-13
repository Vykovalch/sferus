'use client'

import { useState } from 'react'
import { Mail, RefreshCw, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

interface VerifyEmailClientProps {
  email?: string
}

export function VerifyEmailClient({ email }: VerifyEmailClientProps) {
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [cooldown, setCooldown] = useState(0)

  async function handleResend() {
    if (!email || cooldown > 0) return

    setResendStatus('loading')

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: '/',
    })

    if (error) {
      setResendStatus('error')
      setTimeout(() => setResendStatus('idle'), 3000)
      return
    }

    setResendStatus('sent')

    // Кулдаун 60 секунд — защита от спама
    let seconds = 60
    setCooldown(seconds)
    const timer = setInterval(() => {
      seconds -= 1
      setCooldown(seconds)
      if (seconds <= 0) {
        clearInterval(timer)
        setResendStatus('idle')
      }
    }, 1000)
  }

  return (
    <div className="w-full bg-background text-foreground animate-in fade-in duration-300">
      {/* Иконка */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-brand" />
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium tracking-tight mb-2">Проверьте почту</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Мы отправили письмо с ссылкой для подтверждения на{' '}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            'ваш email'
          )}
        </p>
      </div>

      {/* Шаги */}
      <div className="bg-muted/40 rounded-xl p-4 mb-6 space-y-3">
        {[
          'Откройте письмо от Sferus',
          'Нажмите кнопку «Подтвердить email»',
          'Войдите в аккаунт',
        ].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-brand/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-brand">{i + 1}</span>
            </div>
            <span className="text-sm text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>

      {/* Кнопка переотправки */}
      <div className="space-y-3">
        {resendStatus === 'sent' ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Письмо отправлено повторно</span>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={!email || resendStatus === 'loading' || cooldown > 0}
            className="w-full border-input text-muted-foreground hover:text-foreground font-medium cursor-pointer"
          >
            {resendStatus === 'loading' ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Отправляем...
              </>
            ) : cooldown > 0 ? (
              `Отправить повторно (${cooldown}с)`
            ) : (
              'Отправить письмо повторно'
            )}
          </Button>
        )}

        {resendStatus === 'error' && (
          <p className="text-xs text-destructive text-center">
            Не удалось отправить письмо. Попробуйте позже.
          </p>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Не тот email?{' '}
          <Link href="/register" className="text-brand hover:underline font-medium">
            Зарегистрироваться заново
          </Link>
        </p>
      </div>
    </div>
  )
}