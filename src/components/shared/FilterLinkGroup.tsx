import Link from "next/link";

/**
 * Группа фильтра как список ссылок, а не радио-кнопок в форме.
 *
 * Каждый вариант — самостоятельный URL каталога, поэтому семантически это
 * навигация, а не ввод формы: клик сразу переносит на отфильтрованную
 * страницу. Ссылки работают без JS на клиенте и переживают `next/link`
 * prefetch бесплатно — не нужен ни `"use client"`, ни ручная синхронизация
 * состояния с адресной строкой.
 *
 * Своей карточки-обёртки не рисует: когда фильтров несколько, они должны
 * жить в одной общей панели с разделителями между секциями, а не в стопке
 * отдельных карточек — эту обёртку и разделители задаёт родитель
 * (`divide-y` на общем контейнере), см. `CategorySidebar`/`TasksSidebar`.
 */
interface FilterOption {
  label: string;
  href: string;
  active: boolean;
}

interface FilterLinkGroupProps {
  title: string;
  options: FilterOption[];
}

export function FilterLinkGroup({ title, options }: FilterLinkGroupProps) {
  return (
    <div>
      <div className="px-4 py-2.5">
        <h3 className="text-sm font-bold text-foreground tracking-wider">{title}</h3>
      </div>
      <div className="py-1">
        {options.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            scroll={false}
            aria-current={option.active ? "true" : undefined}
            className={`flex items-center gap-2.5 px-4 py-2 text-sm leading-snug transition-colors hover:bg-muted/40 ${
              option.active
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {/* Визуальный радио-индикатор, не настоящий <input type="radio">:
                это ссылки-переходы (см. комментарий выше), а не поля формы,
                клавиатурная навигация стрелками для radiogroup тут не
                работает — поэтому без role="radio"/aria-checked, чтобы не
                обещать поведение, которого нет. Состояние для скринридеров
                уже даёт aria-current выше, кружок — чисто декоративный. */}
            <span
              aria-hidden="true"
              className={`flex items-center justify-center w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                option.active ? "border-brand-heading" : "border-border"
              }`}
            >
              {option.active && <span className="w-1.5 h-1.5 rounded-full bg-brand-heading" />}
            </span>
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
