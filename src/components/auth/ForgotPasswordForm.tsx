'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="w-full text-center bg-background text-foreground animate-in fade-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand/10">
            <CheckCircle className="h-7 w-7 text-brand" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
          Письмо отправлено
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
          Проверьте вашу почту и следуйте инструкциям для сброса пароля
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-brand font-medium hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Вернуться ко входу</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full bg-background text-foreground animate-in fade-in duration-300">

      <div className="lg:hidden flex justify-center mb-8">
        <Logo className="h-9 w-auto" />
      </div>

      <div className="mb-6 text-center lg:text-left">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
          Забыли пароль?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Введите email и мы отправим инструкции для сброса пароля
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              className="pl-10 bg-background border-input text-foreground focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand h-10"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow h-10 cursor-pointer text-sm font-medium transition-colors"
        >
          Отправить инструкции
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-brand font-medium hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Вернуться ко входу</span>
        </Link>
      </div>

    </div>
  )
}
