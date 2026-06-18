import Link from 'next/link'
import { Send } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#272727] py-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-2">
        <Logo variant="inverse" className="text-2xl" />
        <p className="text-xs text-zinc-500">Поиск услуг в Приднестровье</p>
        <Link
          href="https://t.me/sferus_md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mt-1"
        >
          <Send className="h-3.5 w-3.5" />
          @sferus_md
        </Link>
        <p className="text-xs text-zinc-700 mt-2">© 2026 Sferus</p>
      </div>
    </footer>
  )
}