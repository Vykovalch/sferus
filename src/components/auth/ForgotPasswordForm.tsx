'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })

    if (error) {
      setSubmitted(true)
    } else {
      setSubmitted(true)
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="w-full text-center bg-white text-foreground animate-in fade-in duration-300 px-6 py-10 md:px-8 md:pb-8 md:rounded-2xl md:border md:border-border md:shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-brand" />
          </div>
        </div>

        <h2 className="text-2xl font-medium tracking-tight mb-2">Письмо отправлено</h2>
        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
          Если аккаунт с адресом{' '}
          <span className="font-medium text-foreground">{email}</span>{' '}
          существует — вы получите письмо со ссылкой для сброса пароля.
        </p>
        <p className="text-xs text-muted-foreground mb-8">
          Не получили письмо? Проверьте папку «Спам».
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-brand font-medium hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться ко входу
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full bg-white text-foreground animate-in fade-in duration-300 px-6 py-10 md:px-8 md:pb-8 md:rounded-2xl md:border md:border-border md:shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
          Забыли пароль?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Введите email — мы отправим ссылку для сброса пароля
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="pl-10 h-10"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow h-10 cursor-pointer text-sm font-medium transition-colors"
        >
          {loading ? 'Отправляем...' : 'Отправить ссылку'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-brand font-medium hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться ко входу
        </Link>
      </div>
    </div>
  )
}