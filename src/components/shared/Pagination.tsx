import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { type PageItem, pageWindow } from "@/lib/pagination";

/**
 * Пагинация как ряд ссылок, а не клиентский компонент.
 *
 * Тот же принцип, по которому сделаны фильтры (`FilterLinkGroup`): каждая
 * страница — самостоятельный адрес, поэтому это навигация, а не ввод. Работает
 * без JS, переживает «назад» в браузере, индексируется поисковиком и не требует
 * синхронизации состояния с адресной строкой.
 *
 * `buildHref` приходит от страницы: только она знает форму своего адреса
 * и набор фильтров, которые нужно сохранить. Все потребители — серверные
 * компоненты, поэтому функция в пропсах ничего не стоит.
 */
interface PaginationProps {
  page: number;
  pageCount: number;
  buildHref: (page: number) => string;
  /** Подпись для скринридера: «Страницы каталога», «Страницы результатов поиска». */
  label?: string;
}

/**
 * 40px — общая высота элементов управления на сайте (DESIGN.md, «Поля ввода»).
 * До 2026-10-01 здесь стояли `h-9 min-w-9`, и после правки кнопки «Фильтры»
 * пагинация осталась последним элементом на 36px.
 *
 * Обводка фокуса задана явно: это голые ссылки, а не кнопки кита, и без неё
 * у них оставалось бы умолчание браузера, разное в разных браузерах.
 */
const itemClass =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-state";

export function Pagination({ page, pageCount, buildHref, label = "Страницы" }: PaginationProps) {
  // Одна страница — показывать нечего. Пустой ряд стрелок только шумит.
  if (pageCount <= 1) return null;

  const items = pageWindow(page, pageCount);

  return (
    // `flex-wrap` — иначе ряд переполняет контейнер на телефоне (2026-10-01).
    // Счёт: `pageWindow` отдаёт максимум семь элементов (первая, три вокруг
    // текущей, последняя и два пропуска), плюс две стрелки — девять. При 40px
    // и зазорах это около 392px против 328px доступных на экране 360px.
    // Переполнение было и при 36px (≈356px): ряд вылезал за край и давал
    // горизонтальную прокрутку страницы. С переносом он просто встаёт
    // в две строки.
    <nav aria-label={label} className="mt-8 flex flex-wrap items-center justify-center gap-1">
      <PageStep
        href={buildHref(page - 1)}
        disabled={page <= 1}
        label="Предыдущая страница"
        icon={<ChevronLeft aria-hidden="true" className="h-4 w-4" />}
      />

      {items.map((item, index) => (
        <PageNumber
          // У пропусков нет собственного номера, поэтому ключ по позиции.
          // Ряд пересобирается целиком на каждой странице, переупорядочивания нет.
          key={item === "gap" ? `gap-${index}` : item}
          item={item}
          current={page}
          buildHref={buildHref}
        />
      ))}

      <PageStep
        href={buildHref(page + 1)}
        disabled={page >= pageCount}
        label="Следующая страница"
        icon={<ChevronRight aria-hidden="true" className="h-4 w-4" />}
      />
    </nav>
  );
}

function PageNumber({
  item,
  current,
  buildHref,
}: {
  item: PageItem;
  current: number;
  buildHref: (page: number) => string;
}) {
  if (item === "gap") {
    return (
      <span aria-hidden="true" className={`${itemClass} text-muted-foreground`}>
        …
      </span>
    );
  }

  const isCurrent = item === current;

  // Текущая страница — не ссылка: вести с неё некуда, и для скринридера
  // это состояние, а не переход.
  if (isCurrent) {
    return (
      <span aria-current="page" className={`${itemClass} bg-brand/10 text-brand`}>
        {item}
      </span>
    );
  }

  return (
    <Link
      href={buildHref(item)}
      aria-label={`Страница ${item}`}
      className={`${itemClass} text-foreground hover:bg-muted/60`}
    >
      {item}
    </Link>
  );
}

function PageStep({
  href,
  disabled,
  label,
  icon,
}: {
  href: string;
  disabled: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  // На краю диапазона — не ссылка, а погашенный значок: ссылка, ведущая
  // на текущую же страницу, обманывает и мышь, и скринридер.
  if (disabled) {
    return (
      <span aria-hidden="true" className={`${itemClass} text-muted-foreground/40`}>
        {icon}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={`${itemClass} text-foreground hover:bg-muted/60`}
    >
      {icon}
    </Link>
  );
}
