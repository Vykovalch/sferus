'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { signUp } from '@/lib/auth-client'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов')
      setLoading(false)
      return
    }

    const { error } = await signUp.email({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password,
      callbackURL: '/',
    })

    if (error) {
      setError(
        error.code === 'USER_ALREADY_EXISTS'
          ? 'Пользователь с таким email уже существует'
          : 'Ошибка регистрации. Попробуйте снова'
      )
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-full bg-background text-foreground animate-in fade-in duration-300">

      {/* Лого — только на мобильном */}
      <div className="lg:hidden flex justify-center mb-8">
        <Logo className="h-9 w-auto" />
      </div>

      {/* Заголовок */}
      <div className="mb-6 text-center lg:text-left">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
          Создать аккаунт
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Зарегистрируйтесь, чтобы найти специалиста или предложить услуги
        </p>
      </div>

      {/* Вывод системных ошибок */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-normal">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Поле Имя и фамилия */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">Имя и фамилия</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Александр Иванов"
              autoComplete="name"
              required
              className="pl-10 bg-background border-input text-foreground focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand h-10"
            />
          </div>
        </div>

        {/* Поле Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              className="pl-10 bg-background border-input text-foreground focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand h-10"
            />
          </div>
        </div>

        {/* Поле Пароль */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Пароль</Label>
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
              className="pl-10 pr-10 bg-background border-input text-foreground focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand h-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Поле Подтверждение пароля */}
        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="text-sm font-medium">Подтвердите пароль</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm"
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Повторите пароль"
              autoComplete="new-password"
              required
              className="pl-10 pr-10 bg-background border-input text-foreground focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand h-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
              aria-label={showConfirm ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Главная кнопка отправки */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow h-10 cursor-pointer text-sm font-medium transition-colors pt-0.5"
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>

        {/* Разделитель "или" */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">или</span>
          </div>
        </div>

        {/* Кнопка Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full border-input text-foreground hover:bg-muted h-10 cursor-pointer transition-colors text-sm font-medium"
        >
          <svg className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Продолжить с Google</span>
        </Button>

      </form>

      {/* Ссылка на переход к логину */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{' '}
        <Link href="/login" className="text-brand font-medium hover:underline cursor-pointer">
          Войти
        </Link>
      </div>

    </div>
  )
}