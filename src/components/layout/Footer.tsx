import Link from 'next/link'
import { Phone, Mail, Send, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

const clientLinks = [
  { label: 'Создать задание', href: '/tasks/new' },
  { label: 'Найти специалиста', href: '/services' },
  { label: 'Категории услуг', href: '/services' },
]

const executorLinks = [
  { label: 'Стать исполнителем', href: '/register' },
  { label: 'Получать заказы', href: '/tasks' },
  { label: 'Условия работы', href: '#' },
]

const companyLinks = [
  { label: 'О нас', href: '#' },
  { label: 'Контакты', href: '#' },
  { label: 'Помощь', href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 md:gap-12">

          {/* Описание + контакты */}
          <div>
            <Logo variant="inverse" className="h-10 w-auto mb-4" />
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Платформа для поиска специалистов в Приднестровье
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:+37377712345"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+373 777 12345</span>
              </a>
              <a
                href="mailto:info@sferus.md"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@sferus.md</span>
              </a>
            </div>

            {/* Соцсети */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                title="Telegram"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50 border border-gray-600 hover:bg-[#0088cc] hover:border-[#0088cc] transition-colors group"
              >
                <Send className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                title="Viber"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50 border border-gray-600 hover:bg-[#665CAC] hover:border-[#665CAC] transition-colors group"
              >
                <Phone className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                title="WhatsApp"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50 border border-gray-600 hover:bg-[#25D366] hover:border-[#25D366] transition-colors group"
              >
                <MessageCircle className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Для клиентов */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Для клиентов</h4>
            <ul className="space-y-2">
              {clientLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Для исполнителей */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Для исполнителей</h4>
            <ul className="space-y-2">
              {executorLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Компания</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Копирайт */}
        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
          <p>© 2026 Сферус. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
