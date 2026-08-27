"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

  // Раскрытие лупы в полноширинную строку поиска ниже lg (см. ниже) —
  // локальное состояние одного компонента, внешний стор не нужен: в
  // отличие от hero-search-store.ts, тут нет двух разных поддеревьев,
  // которым нужно об этом договориться.
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isMobileSearchOpen) return;
    mobileSearchInputRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMobileSearchOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSearchOpen]);

  // Ваши ссылки навигации
  const navLinks = [
    { href: "/services", label: "Услуги" },
    { href: "/tasks", label: "Задания" },
    { href: "/#how-it-works", label: "Как это работает" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-hero-bg/95 backdrop-blur-md">
      <PageContainer>
        <div className="flex h-16 lg:h-[72px] items-center gap-4">
          {/* Раскрытая мобильная строка поиска (ниже lg). Полностью
              заменяет собой остальное содержимое хедера на время поиска —
              логотип, навигация и меню всё равно не нужны в этот момент,
              а места на узком экране на всё сразу не хватит. При lg+ этой
              панели никогда не место (см. lg:hidden ниже) — на всякий
              случай, если состояние осталось true при ресайзе окна. */}
          {isMobileSearchOpen && (
            <form
              action="/services"
              method="get"
              className="flex lg:hidden items-center gap-2 w-full"
            >
              <label htmlFor="mobile-header-search" className="sr-only">
                Поиск услуг
              </label>
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                />
                <input
                  ref={mobileSearchInputRef}
                  id="mobile-header-search"
                  name="q"
                  type="search"
                  maxLength={SEARCH_QUERY_MAX_LENGTH}
                  placeholder="Ремонт, уборка, репетитор..."
                  className="w-full h-10 pl-9 pr-3 text-sm bg-background border border-input rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <button
                type="button"
                aria-label="Закрыть поиск"
                onClick={() => setIsMobileSearchOpen(false)}
                className="shrink-0 text-foreground/80 hover:text-primary transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
          )}

          <div
            className={cn(
              "flex items-center justify-between gap-4 w-full",
              isMobileSearchOpen && "hidden lg:flex",
            )}
          >
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
                вместо формы — лупа, разворачивающая точно такую же строку
                поиска на всю ширину (см. isMobileSearchOpen выше).

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
                showCompactSearch
                  ? "opacity-100 max-w-sm"
                  : "opacity-0 max-w-0 pointer-events-none",
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

            {/* Лупа на узких экранах подчиняется тому же правилу, что и
                компактная форма выше: не главная страница, либо Hero-инпут
                уже скрылся при скролле. Без этого условия на главной, пока
                Hero-строка поиска ещё видна, лупа в хедере дублировала бы её.
                По клику не переходит никуда — раскрывает строку поиска прямо
                в хедере (см. isMobileSearchOpen выше), раньше вела на
                /services, где после недавней правки поля поиска больше нет. */}
            {showCompactSearch && (
              <button
                type="button"
                aria-label="Найти услугу"
                aria-expanded={isMobileSearchOpen}
                onClick={() => setIsMobileSearchOpen(true)}
                className="lg:hidden text-foreground/80 hover:text-primary transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

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
        </div>
      </PageContainer>
    </header>
  );
}
