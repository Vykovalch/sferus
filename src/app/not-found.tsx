'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    // Изменено: Обычный div вместо main, чтобы не ломать HTML-семантику внутри RootLayout
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center bg-background text-foreground animate-in fade-in duration-300">
      
      {/* Большой системный код ошибки */}
      <p className="text-7xl font-bold tracking-tighter text-muted-foreground/30 select-none">
        404
      </p>
      
      {/* Заголовок */}
      <h1 className="mt-4 text-2xl font-medium tracking-tight">
        Страница не найдена
      </h1>
      
      {/* Описание */}
      <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
        Возможно, эта страница была удалена, перемещена или вы ошиблись при вводе адреса.
      </p>
      
      <div className="mt-8">
        {/* Изменено: Ссылка обернута в кнопку из UI-кита с помощью пропса asChild */}
        <Button
          variant="outline"
          asChild
          className="gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer shadow-sm transition-colors"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            На главную
          </Link>
        </Button>
      </div>

    </div>
  )
}