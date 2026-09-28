"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  CREATE_LISTING_OPTIONS,
  CreateListingOptionLabel,
} from "@/components/layout/CreateListingMenu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  return (
    <div className="xl:hidden flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Открыть меню"
            className="relative tap-target text-muted-foreground hover:text-foreground transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>

        {/* Слева — со стороны кнопки: бургер стоит слева от логотипа. */}
        <SheetContent side="left" className="w-72 px-0 py-0">
          <SheetTitle className="sr-only">Навигация</SheetTitle>

          <nav className="px-4 py-6 flex flex-col gap-1">
            <Link
              href="/services"
              onClick={handleClose}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2 px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Услуги
            </Link>
            <Link
              href="/tasks"
              onClick={handleClose}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2 px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Задания
            </Link>
            <Link
              href="/#how-it-works"
              onClick={handleClose}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2 px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Как это работает
            </Link>

            {/* «Разместить» — те же пункты, что в выпадающем меню шапки
                (CreateListingMenu). Видны и гостю: страницы создания сами
                отправят на вход с возвратом в форму.

                Скрыты от 1024px (решение владельца, 2026-09-23): там кнопка
                «Разместить» уже стоит в шапке, и повторять её пункты в меню
                незачем. Бургер — переполнение строки: в нём лежит ровно то,
                что в шапку не поместилось. Ниже 1024px кнопки в шапке нет,
                и эта секция — единственный вход в размещение. */}
            <div className="lg:hidden border-t border-border mt-2 pt-4 flex flex-col gap-1">
              {/* 14px, а не 12px из умолчания `DropdownMenuLabel` (решение
                  владельца, 2026-09-28). Умолчание кита рассчитано на плотное
                  десктопное выпадающее меню; в шторке, где нажимают пальцем,
                  оно выпадало из шкалы: заголовок группы был набран тем же
                  кеглем и цветом, что самый мелкий текст на экране — описания
                  пунктов, которые он возглавляет.

                  Сейчас каждый уровень отличается от соседнего минимум двумя
                  признаками: разделы 16px medium тёмным, названия пунктов
                  14px semibold тёмным, этот заголовок 14px medium серым,
                  описания 12px серым.

                  Кегль не адаптивный: бургер живёт только ниже 1024px,
                  а шторка на любой ширине 288px (`w-72`) — содержимое
                  не перестраивается, и реагировать контрольной точке не на что. */}
              <p className="px-2 pb-2 text-sm font-medium text-muted-foreground">Разместить</p>
              {CREATE_LISTING_OPTIONS.map((option) => (
                <Link
                  key={option.href}
                  href={option.href}
                  onClick={handleClose}
                  className="flex items-start gap-3 rounded-md px-2 py-2.5 hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CreateListingOptionLabel option={option} />
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
