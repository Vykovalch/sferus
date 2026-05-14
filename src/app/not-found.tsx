import Link from 'next/link'
import { Home} from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-500 text-muted-foreground">404</p>
      <h1 className="mt-4 text-2xl font-500">Страница не найдена</h1>
      <p className="mt-2 text-muted-foreground">
        Возможно страница была удалена или вы ошиблись в адресе
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent"
        >
          <Home size={16} />
          На главную
        </Link>
      </div>
    </main>
  )
}
