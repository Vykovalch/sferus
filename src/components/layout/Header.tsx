"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import type { Session } from "@/lib/auth";

interface HeaderProps {
  session: Session | null; // Сессия из серверного layout (auth.api.getSession)
}

export function Header({ session }: HeaderProps) {
  const pathname = usePathname();

  // Ваши ссылки навигации
  const navLinks = [
    { href: "/services", label: "Услуги" },
    { href: "/tasks", label: "Задания" },
    { href: "/#how-it-works", label: "Как это работает" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-hero-bg/95 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Левая часть: Логотип Sferus */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              <Logo className="text-2xl" />
            </Link>
          </div>

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
                  className="hidden md:inline-flex h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-colors px-5"
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
    </header>
  );
}