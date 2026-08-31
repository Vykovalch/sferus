import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";

export function Footer() {
  return (
    <footer className="bg-footer-bg py-16">
      <PageContainer>
        {/* Основная сетка */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-4">
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
                Создать задание
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
                Создать услугу
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
          {/* neutral-300: на фоне --footer-bg даёт 8:1. Более тёмные оттенки
              не годятся — neutral-400 там 4.7:1 (впритык), neutral-500 — 2.5:1 */}
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
