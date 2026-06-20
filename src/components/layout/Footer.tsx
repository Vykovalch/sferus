import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export function Footer() {
  return (
    <footer className="bg-[#eaedff] py-16">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Основная сетка */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Логотип и описание */}
          <div className="space-y-4">
            <Logo className="text-2xl" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Маркетплейс услуг в Приднестровье. Мы объединяем заказчиков и профессиональных исполнителей.
            </p>
          </div>

          {/* Пользователям */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Клиентам</h4>
            <nav className="flex flex-col gap-2">
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/services">Все услуги</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/#how-it-works">Как это работает</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Безопасность</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Помощь</Link>
            </nav>
          </div>

          {/* Исполнителям */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Исполнителям</h4>
            <nav className="flex flex-col gap-2">
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/services/new">Создать анкету</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/tasks">Поиск заданий</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Советы по работе</Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Партнёрам</Link>
            </nav>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Контакты</h4>
            <div className="flex flex-col gap-2">
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="mailto:support@sferus.md">support@sferus.md</Link>
              <p className="text-sm text-muted-foreground">г. Тирасполь</p>
            </div>
          </div>

        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Sferus. Все права защищены.</p>
          <div className="flex gap-6">
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Условия использования</Link>
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Приватность</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}