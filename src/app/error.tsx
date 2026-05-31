'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // Хорошая практика Next.js — логировать ошибку в консоль или трекер (Sentry/Logrocket)
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    // Изменено: Используем безопасный центрированный контейнер, который отлично встанет внутрь main.flex-1
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center bg-background text-foreground animate-in fade-in duration-300">
      
      {/* Большой системный код ошибки */}
      <p className="text-7xl font-bold tracking-tighter text-muted-foreground/30 select-none">
        500
      </p>
      
      {/* Заголовок */}
      <h1 className="mt-4 text-2xl font-medium tracking-tight">
        Что-то пошло не так
      </h1>
      
      {/* Описание */}
      <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
        Внутренняя ошибка сервера. Не беспокойтесь, мы уже в курсе и чиним её. Попробуйте обновить страницу.
      </p>
      
      {/* Изменено: Нативная кнопка заменена на Button из UI-кита */}
      <Button
        type="button"
        variant="outline"
        onClick={reset}
        className="mt-8 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer shadow-sm transition-all"
      >
        <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
        Попробовать снова
      </Button>

    </div>
  )
}