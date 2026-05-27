'use client'

import Link from 'next/link'
import { Phone, Mail, Send, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

type FooterLink = {
  label: string
  href: string
}

const clientLinks: FooterLink[] = [
  { label: 'Создать задание', href: '/tasks/new' },
  { label: 'Найти специалиста', href: '/services' },
  { label: 'Категории услуг', href: '/services' },
]

const executorLinks: FooterLink[] = [
  { label: 'Стать исполнителем', href: '/register' },
  { label: 'Получать заказы', href: '/tasks' },
  { label: 'Условия работы', href: '#' },
]

const companyLinks: FooterLink[] = [
  { label: 'О нас', href: '#' },
  { label: 'Контакты', href: '#' },
  { label: 'Помощь', href: '#' },
]

export function Footer() {
  return (
    <footer className="dark bg-zinc-950 text-zinc-50 py-12 md:py-16 border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 md:gap-12">

          {/* Описание + контакты */}
          <div className="flex flex-col space-y-4">
            <div>
              <Logo variant="inverse" className="h-9 w-auto mb-3" />
              {/* Исправлено: вернули text-sm для комфортного чтения */}
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                Платформа для поиска специалистов в Приднестровье
              </p>
            </div>
            
            {/* Исправлено: все контакты переведены на стандартный text-sm */}
            <div className="space-y-2 text-sm">
              <a
                href="tel:+37377712345"
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              >
                <Phone className="h-4 w-4 flex-shrink-0 text-zinc-500" />
                <span>+373 777 12345</span>
              </a>
              <a
                href="mailto:info@sferus.md"
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              >
                <Mail className="h-4 w-4 flex-shrink-0 text-zinc-500" />
                <span className="truncate">info@sferus.md</span>
              </a>
            </div>

            {/* Соцсети */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="/"
                title="Telegram"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-50 text-zinc-400 transition-all cursor-pointer group"
              >
                <Send className="h-4 w-4 group-hover:scale-105 transition-transform" />
              </a>
              <a
                href="/"
                title="Viber"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-50 text-zinc-400 transition-all cursor-pointer group"
              >
                <Phone className="h-4 w-4 group-hover:scale-105 transition-transform" />
              </a>
              <a
                href="/"
                title="WhatsApp"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-50 text-zinc-400 transition-all cursor-pointer group"
              >
                <MessageCircle className="h-4 w-4 group-hover:scale-105 transition-transform" />
              </a>
            </div>
          </div>

          {/* Для клиентов */}
          <div>
            {/* Заголовки оставили аккуратными text-xs uppercase для контраста */}
            <h4 className="text-xs font-medium tracking-wider text-zinc-200 uppercase mb-4">
              Для клиентов
            </h4>
            <ul className="space-y-2.5">
              {clientLinks.map((link: FooterLink) => (
                <li key={`footer-client-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Для исполнителей */}
          <div>
            <h4 className="text-xs font-medium tracking-wider text-zinc-200 uppercase mb-4">
              Для исполнителей
            </h4>
            <ul className="space-y-2.5">
              {executorLinks.map((link: FooterLink) => (
                <li key={`footer-executor-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h4 className="text-xs font-medium tracking-wider text-zinc-200 uppercase mb-4">
              Компания
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link: FooterLink) => (
                <li key={`footer-company-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Копирайт */}
        <div className="border-t border-zinc-900 mt-12 pt-6 text-center text-zinc-600 text-xs font-normal">
          <p>© 2026 Сферус. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
