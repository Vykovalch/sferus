import { X } from "lucide-react";
import Link from "next/link";

interface FilterChip {
  label: string;
  /** Адрес с этим одним фильтром снятым, остальные — как были. */
  removeHref: string;
}

interface ActiveFilterChipsProps {
  chips: FilterChip[];
  /** Адрес без единого фильтра. Показывается только при 2+ активных —
   * при одном плашка со своим крестиком и так делает то же самое. */
  clearAllHref: string;
}

/**
 * Применённые фильтры над сеткой результатов — не подпись «Активные
 * фильтры:» (сами плашки уже читаются как фильтры без пояснения), а именно
 * действие: снять один конкретный фильтр или все разом, не возвращаясь
 * взглядом к сайдбару/шторке фильтров.
 *
 * Цвет — brand-heading, не кармин: та же логика, что и у радио-индикаторов
 * в `FilterLinkGroup` — кармин зарезервирован под кнопки и ссылки-действия,
 * а это скорее метка состояния, что и подтверждает крестик рядом с текстом.
 */
export function ActiveFilterChips({ chips, clearAllHref }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.removeHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-heading/5 text-brand-heading text-sm pl-3 pr-2.5 py-1.5 hover:bg-brand-heading/10 transition-colors"
        >
          {chip.label}
          <X aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      ))}

      {chips.length > 1 && (
        <Link
          href={clearAllHref}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Сбросить всё
        </Link>
      )}
    </div>
  );
}
