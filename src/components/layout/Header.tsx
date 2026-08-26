"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  getHeroIntersecting,
  getHeroIntersectingServerSnapshot,
  subscribeHeroIntersecting,
} from "@/components/layout/hero-search-store";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { SEARCH_QUERY_MAX_LENGTH } from "@/features/services/schemas";
import type { Session } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface HeaderProps {
  session: Session | null; // Сессия из серверного layout (auth.api.getSession)
}

export function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Видимость Hero-инпута приходит из стора, за которым следит SearchBar
  // в Hero (см. hero-search-store.ts). На остальных страницах Hero нет,
  // поэтому источник неважен — компактный поиск виден всегда.
  const heroVisible = useSyncExternalStore(
    subscribeHeroIntersecting,
    getHeroIntersecting,
    getHeroIntersectingServerSnapshot,
  );
  const showCompactSearch = isHome ? !heroVisible : true;

  // Ваши ссылки навигации
  const navLinks = [
    { href: "/services", label: "Услуги" },
    { href: "/tasks", label: "Задания" },
    { href: "/#how-it-works", label: "Как это работает" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-hero-bg/95 backdrop-blur-md">
      <PageContainer>
        <div className="flex h-16 lg:h-[72px] items-center justify-between gap-4">
          {/* Левая часть: Логотип Sferus */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              <Logo className="text-2xl" />
            </Link>
          </div>

          {/* Поиск.
              Обычная форма с method="get": состояние живёт в адресной строке,
              поиск работает без JS, и не нужен ни клиентский компонент,
              ни синхронизация состояния с URL — тот же принцип, по которому
              фильтры каталога сделаны ссылками.

              На узких экранах поле не помещается в шапку h-16, поэтому там
              иконка ведёт на /services, где стоит полная строка поиска.

              Sticky-поведение (только на главной): пока в Hero виден его
              собственный инпут поиска, здесь этого блока нет — появляется
              плавно (opacity + max-width), когда Hero-инпут скрывается под
              шапкой, и уходит обратно при скролле вверх. На остальных
              страницах Hero нет, поэтому блок виден сразу и без анимации —
              transition-классы навешиваются только когда isHome, иначе при
              переходе с главной (где он был скрыт) на другую страницу он бы
              «доезжал» с анимацией вместо мгновенного появления. */}
          <search
            className={cn(
              "hidden lg:flex flex-1 items-center overflow-hidden",
              isHome && "transition-[opacity,max-width] duration-300 ease-out",
              showCompactSearch ? "opacity-100 max-w-sm" : "opacity-0 max-w-0 pointer-events-none",
            )}
          >
            <form action="/services" method="get" className="flex w-full items-center relative">
              <label htmlFor="header-search" className="sr-only">
                Поиск услуг
              </label>
              <Search
                aria-hidden="true"
                className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"
              />
              <input
                id="header-search"
                name="q"
                type="search"
                maxLength={SEARCH_QUERY_MAX_LENGTH}
                placeholder="Ремонт, уборка, репетитор..."
                className="w-full h-10 pl-9 pr-3 text-sm bg-background border border-input rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
              />
            </form>
          </search>

          <Link
            href="/services"
            aria-label="Поиск услуг"
            className="lg:hidden text-foreground/80 hover:text-primary transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Центр: Навигация (Inter, 14px, ховер перекрашивает в вишневый) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              // Строгая проверка активности страницы (якоря не горят красным постоянно)
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-semibold tracking-[0.01em] transition-colors ${
                    isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Правая часть: Блок действий (Кнопки / Меню пользователя) */}
          <div className="flex items-center gap-2 md:gap-4">
            {session ? (
              <>
                {/* Кнопки авторизованного пользователя */}
                <Button
                  asChild
                  variant="outline"
                  className="hidden md:inline-flex h-11 border-secondary text-secondary hover:bg-secondary/5 font-semibold transition-colors px-5"
                >
                  <Link href="/services/new">Создать услугу</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="hidden md:inline-flex h-11 border-primary text-primary hover:bg-primary/5 font-semibold transition-colors px-5"
                >
                  <Link href="/tasks/new">Создать задание</Link>
                </Button>

                <div className="hidden md:block h-6 w-px bg-border mx-1" />
                <UserMenu session={session} />
              </>
            ) : (
              <Link
                href="/login"
                className="text-base font-semibold text-foreground/80 hover:text-primary transition-colors px-2"
              >
                Войти
              </Link>
            )}

            {/* Мобильное меню (бургер) */}
            <MobileMenu session={session} />
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
