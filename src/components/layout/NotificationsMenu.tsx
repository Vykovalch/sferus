"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Колокольчик уведомлений в шапке. Виден только вошедшему, рядом с сердечком
 * избранного и аватаром.
 *
 * **Пока это оболочка без данных** (решение владельца, 2026-09-21: начать
 * с иконки). Событий в базе ещё нет, поэтому панель всегда показывает пустое
 * состояние. Что сюда приедет дальше — в PROGRESS, раздел «Уведомления»:
 * решения модерации и раскрытие контактов.
 *
 * **Счётчика непрочитанных здесь намеренно нет.** Появится вместе с данными
 * и только когда их больше нуля: бейдж с нулём каждый день сообщает
 * посетителю, что на площадке ничего не происходит.
 *
 * Размер кнопки, фон при наведении и зона касания — как у сердечка рядом,
 * чтобы тройка иконок читалась одним блоком.
 */
export function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Уведомления"
          title="Уведомления"
          className="relative tap-target flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell aria-hidden="true" className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 shadow-xl">
        <div className="px-3 py-2">
          <p className="text-base font-semibold text-foreground">Уведомления</p>
        </div>

        {/* Пустое состояние без бодрых формулировок вроде «Вы всё прочитали!»:
            человек ничего не читал, уведомлений просто нет. Вторая строка
            объясняет, чего ждать, — иначе пустая панель выглядит поломкой. */}
        <div className="px-3 pb-3 pt-1">
          <p className="text-sm text-muted-foreground">Пока ничего</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Здесь появятся решения модерации по вашим объявлениям и отметки о том, что ваши контакты
            открыли.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
