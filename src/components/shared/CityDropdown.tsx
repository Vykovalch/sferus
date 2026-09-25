"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CityOption } from "@/features/cities/queries";
import { cn } from "@/lib/utils";

const ALL_CITIES = "Все города";

interface CityDropdownProps {
  /** Города из БД: клиентский компонент их сам получить не может. */
  cities: CityOption[];
  /** Выбранный город; `undefined` — «Все города». */
  value: string | undefined;
  onValueChange: (city: string | undefined) => void;
  /**
   * `hero` — крупный вариант для строки поиска на главной; `compact` — внутри
   * поля в шапке от 1024px; `block` — в поиске, раскрытом по лупе (до 1024px):
   * на телефоне отдельной строкой во всю ширину, от 768px — компактной кнопкой
   * в одну строку с полем.
   */
  variant?: "hero" | "compact" | "block";
}

/**
 * Выбор города в форме поиска.
 *
 * Управляемый: значение хранит черновик поиска (`search-context.tsx`),
 * общий для Hero и шапки, — иначе выбранный в Hero город не доезжал бы до шапки.
 *
 * Скрытое поле `city` при «Всех городах» **не отправляется вовсе**. Раньше в нём
 * уходила строка «Все города»: Hero вычищал её вручную, а обычная форма
 * отправила бы `?city=Все города`, и выдача оказалась бы пустой — такого города
 * в базе нет.
 */
export function CityDropdown({
  cities,
  value,
  onValueChange,
  variant = "hero",
}: CityDropdownProps) {
  const label = value ?? ALL_CITIES;

  return (
    <>
      {value !== undefined && <input type="hidden" name="city" value={value} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            aria-label={`Город: ${label}`}
            className={cn(
              "flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-0",
              // tap-target — зона касания 44px на телефоне (globals.css): сама
              // кнопка в Hero 32px. У block высота и так 44px; compact — поле
              // шапки на десктопе, внутри overflow-hidden.
              variant === "hero" && "px-2 relative tap-target",
              // 11rem — самое длинное название («Григориополь») с иконкой
              // и стрелкой около 160px; при 9.5rem оно обрезалось.
              variant === "compact" && "h-8 px-2 rounded-full max-w-[11rem]",
              variant === "block" &&
                "h-11 w-full justify-start px-3 rounded-xl border border-input md:h-10 md:w-auto md:max-w-[12rem] md:rounded-full",
            )}
          >
            <MapPin className={cn("shrink-0", variant === "hero" ? "h-4 w-4" : "h-3.5 w-3.5")} />
            {/* Название города — основным цветом текста, а не приглушённым
                (решение владельца, 2026-09-25). Это выбранное значение
                и подпись кнопки, а не подсказка: приглушённым оно совпадало
                с плейсхолдером соседнего поля и с надписью под строкой поиска —
                один цвет, один кегль, одно начертание в трёх разных ролях.

                Осветлить плейсхолдер вместо этого было нельзя: он уже
                на своём уровне, а `/70` давали 3.5:1 при норме 4.5 и были
                убраны 2026-09-21. Развести оттенки можно было только подняв
                значение вверх.

                Значок и стрелка остаются приглушёнными — они маркеры, а не
                содержимое; на наведении темнеют вместе с кнопкой. */}
            <span
              className={cn(
                "font-medium truncate text-foreground",
                variant === "hero" ? "text-base" : "text-sm",
                variant === "block" && "flex-1 text-left",
              )}
            >
              {label}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={variant === "compact" ? "end" : "start"}
          className="min-w-[calc(var(--radix-dropdown-menu-trigger-width)+2rem)]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {[undefined, ...cities.map((c) => c.name)].map((name) => (
            <DropdownMenuItem
              key={name ?? ALL_CITIES}
              onClick={() => onValueChange(name)}
              className={cn(
                "cursor-pointer py-2 font-medium text-foreground",
                variant === "hero" ? "text-base" : "text-sm",
              )}
            >
              {name ?? ALL_CITIES}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
