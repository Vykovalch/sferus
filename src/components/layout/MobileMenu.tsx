"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import type { Session } from "@/lib/auth";

interface MobileMenuProps {
  session: Session | null;
}

export function MobileMenu({ session }: MobileMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="md:hidden flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        /* Изменено: убрана сильная прозрачность, добавлен четкий bg-background 
     для стопроцентного перекрытия контента под меню */
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-xl z-40">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {/* Основные ссылки навигации */}
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-foreground hover:text-brand transition-colors"
            >
              Услуги
            </Link>
            <Link
              href="/tasks"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-foreground hover:text-brand transition-colors"
            >
              Задания
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-foreground hover:text-brand transition-colors"
            >
              Как это работает
            </Link>

            {/* Блок действий авторизованного пользователя */}
            {session && (
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground hover:text-brand transition-colors"
                >
                  Личный кабинет
                </Link>

                <Link
                  href="/services/new"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand/10 transition-colors"
                >
                  Создать услугу
                </Link>

                <Link
                  href="/tasks/new"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
                >
                  Создать задание
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/90 transition-colors pt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}