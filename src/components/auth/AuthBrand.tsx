import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export function AuthBrand() {
  return (
    <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0d7a5f] to-[#0a6149] text-white">
      <Link href="/">
        <Logo footer className="h-10" />
      </Link>
      <div>
        <h2 className="text-3xl font-semibold mb-4">
          Найдите специалиста в Приднестровье
        </h2>
        <p className="text-white/80 mb-8">
          Исполнители с отзывами из вашего города — для любой задачи
        </p>
        {/* Social proof */}
        <div className="flex items-center gap-6 text-white/70 text-sm">
          <span><span className="font-bold text-white">400+</span> исполнителей</span>
          <span><span className="font-bold text-white">500+</span> объявлений</span>
        </div>
      </div>
      <p className="text-white/40 text-sm">© 2026 Sferus</p>
    </div>
  )
}
