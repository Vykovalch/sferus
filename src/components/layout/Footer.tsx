import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'
import { Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#eaedff] py-16">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Основная сетка */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-4">

          {/* Логотип и описание */}
          <div className="space-y-4">
            <Logo className="text-2xl" />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Маркетплейс услуг в Приднестровье. Мы объединяем заказчиков и профессиональных исполнителей.
              </p>
            </div>
          </div>

          {/* Клиентам */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Клиентам</h4>
            <nav className="flex flex-col gap-2">
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/services">Все услуги</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/tasks/new">Создать задание</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/#how-it-works-clients">Как это работает</Link>
            </nav>
          </div>

          {/* Исполнителям */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Исполнителям</h4>
            <nav className="flex flex-col gap-2">
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/tasks">Поиск заданий</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/services/new">Разместить услугу</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/#how-it-works-executors">Как это работает</Link>
              {/* «Партнёрам» скрыто до появления партнёрской программы — страницы под неё пока нет */}
            </nav>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Контакты</h4>
            <div className="flex flex-col gap-3">
              <Link className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" href="mailto:hello@sferus.md">
                <Mail className="h-4 w-4 flex-shrink-0" />
                hello@sferus.md
              </Link>
              <Link className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" href="tel:+373778543333">
                <Phone className="h-4 w-4 flex-shrink-0" />
                +373 778 54 333
              </Link>              
            </div>
          </div>

        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-border/40 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Sferus. Все права защищены.</p>
          <div className="flex gap-6">
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/terms">Условия использования</Link>
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/privacy">Приватность</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
