'use client'

import { RefreshCw } from 'lucide-react'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-500 text-muted-foreground">500</p>
      <h1 className="mt-4 text-2xl font-500">Что-то пошло не так</h1>
      <p className="mt-2 text-muted-foreground">
        Произошла ошибка. Попробуйте обновить страницу
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent"
      >
        <RefreshCw size={16} />
        Попробовать снова
      </button>
    </main>
  )
}