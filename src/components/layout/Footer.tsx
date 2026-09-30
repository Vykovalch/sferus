import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";

export function Footer() {
  // Отступы по шкале секций главной — 40 / 48 / 64 (2026-09-29). Раньше стояли
  // неадаптивные 64px: на широком экране они совпадали с ритмом страницы,
  // а на телефоне подвал получал в полтора раза больше воздуха, чем любая
  // секция над ним, и стык с блоком призыва выбивался из ритма
  // (40 + 64 = 104 вместо 80). DESIGN.md, «Ритм отступов на главной».
  return (
    <footer className="bg-footer-bg py-10 sm:py-12 lg:py-16">
      <PageContainer>
        {/* Основная сетка. Промежуток между колонками на ступень меньше
            паддинга подвала: на телефоне колонки встают друг под друга,
            и 40px делили бы группы ссылок шире, чем отступ под заголовком
            секции на той же ширине. С 768px колонки идут в ряд, и 40px
            работают по горизонтали, где воздух дешевле. */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 mb-4">
          {/* Логотип и описание */}
          <div className="space-y-4">
            <Logo className="text-2xl" variant="inverse" />
            <div className="pt-2">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Объединяем заказчиков и профессиональных исполнителей.
              </p>
            </div>
          </div>

          {/* Клиентам */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Клиентам</h4>
            <nav className="flex flex-col gap-2">
              <Link
                className="text-sm text-neutral-300 hover:text-white transition-colors"
                href="/services"
              >
                Все услуги
              </Link>
              <Link
                className="text-sm text-neutral-300 hover:text-white transition-colors"
                href="/tasks/new"
              >
                Разместить задание
              </Link>
              <Link
                className="text-sm text-neutral-300 hover:text-white transition-colors"
                href="/#how-it-works-clients"
              >
                Как это работает
              </Link>
            </nav>
          </div>

          {/* Исполнителям */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Исполнителям</h4>
            <nav className="flex flex-col gap-2">
              <Link
                className="text-sm text-neutral-300 hover:text-white transition-colors"
                href="/services/new"
              >
                Разместить услугу
              </Link>
              <Link
                className="text-sm text-neutral-300 hover:text-white transition-colors"
                href="/tasks"
              >
                Поиск заданий
              </Link>
              <Link
                className="text-sm text-neutral-300 hover:text-white transition-colors"
                href="/#how-it-works-executors"
              >
                Как это работает
              </Link>
              {/* «Партнёрам» скрыто до появления партнёрской программы — страницы под неё пока нет */}
            </nav>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Контакты</h4>
            <div className="flex flex-col gap-3">
              <Link
                className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
                href="mailto:hello@sferus.net"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                hello@sferus.net
              </Link>
              <Link
                className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
                href="tel:+37300000000"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                +373 000 000 00
              </Link>
            </div>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* neutral-300: на фоне --footer-bg (#383E41) даёт 7.3:1. Более тёмные
              оттенки не годятся — neutral-400 там 4.2:1, ниже нормы 4.5:1 */}
          <p className="text-sm text-neutral-300">© 2026 Sferus. Все права защищены.</p>
          <div className="flex gap-6">
            <Link
              className="text-sm text-neutral-300 hover:text-white transition-colors"
              href="/terms"
            >
              Условия использования
            </Link>
            <Link
              className="text-sm text-neutral-300 hover:text-white transition-colors"
              href="/privacy"
            >
              Приватность
            </Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
