'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ResetPasswordFormProps {
  token?: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Невалидный или отсутствующий токен — показываем ошибку сразу
  if (!token) {
    return (
      <div className="w-full bg-background text-foreground animate-in fade-in duration-300">
        <div className="lg:hidden flex justify-center mb-8">
          <Logo className="h-9 w-auto" />
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-medium tracking-tight mb-2 text-center">
          Ссылка недействительна
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
          Ссылка для сброса пароля устарела или уже была использована.
          Запросите новую.
        </p>

        <Button
          asChild
          className="w-full bg-brand hover:bg-brand/90 text-brand-foreground h-10 font-medium cursor-pointer"
        >
          <Link href="/forgot-password">Запросить новую ссылку</Link>
        </Button>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Пароли не совпадают')
      return
    }

    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов')
      return
    }

    setLoading(true)

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    if (error) {
      // Токен истёк (1 час) или уже использован
      if (error.code === 'INVALID_TOKEN' || error.code === 'TOKEN_EXPIRED') {
        setError('Ссылка устарела. Запросите новую.')
      } else {
        setError('Что-то пошло не так. Попробуйте снова.')
      }
      setLoading(false)
      return
    }

    router.push('/reset-password/success')
  }

  return (
    <div className="w-full bg-background text-foreground animate-in fade-in duration-300">
      <div className="lg:hidden flex justify-center mb-8">
        <Logo className="h-9 w-auto" />
      </div>

      <div className="mb-6 text-center lg:text-left">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
          Новый пароль
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Придумайте надёжный пароль для вашего аккаунта
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
          {error.includes('устарела') && (
            <Link href="/forgot-password" className="block mt-1 underline font-medium">
              Запросить новую ссылку
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">Новый пароль</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Минимум 8 символов"
              autoComplete="new-password"
              required
              minLength={8}
              className="pl-10 pr-10 h-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Повторите пароль</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm"
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Повторите пароль"
              autoComplete="new-password"
              required
              className="pl-10 pr-10 h-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showConfirm ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow h-10 cursor-pointer text-sm font-medium transition-colors"
        >
          {loading ? 'Сохраняем...' : 'Сохранить пароль'}
        </Button>
      </form>
    </div>
  )
}
