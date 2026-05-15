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
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0d7a5f]/10">
              <CheckCircle className="h-8 w-8 text-[#0d7a5f]" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-2">Письмо отправлено</h2>
          <p className="text-gray-600 mb-8">
            Проверьте вашу почту и следуйте инструкциям для сброса пароля
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[#0d7a5f] font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться ко входу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">

        {/* Лого — только на мобильном */}
        <div className="lg:hidden flex justify-center mb-8">
          <Logo className="h-12" />
        </div>

        {/* Заголовок */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Забыли пароль?</h2>
          <p className="text-gray-600">
            Введите email и мы отправим инструкции для сброса пароля
          </p>
        </div>

        {/* Форма */}
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
        >
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                className="pl-10 border-gray-300 focus:border-[#0d7a5f] focus:ring-[#0d7a5f]"
              />
            </div>
          </div>

          {/* Кнопка */}
          <Button
            type="submit"
            className="w-full bg-[#0d7a5f] hover:bg-[#0a6149] text-white shadow-md h-10"
          >
            Отправить инструкции
          </Button>

        </form>

        {/* Ссылка назад */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-[#0d7a5f] font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться ко входу
          </Link>
        </div>

      </div>
    </div>
  )
}
