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
 * **Без панели и без разделителей** (решение владельца, 2026-09-29). Раньше
 * группы лежали в общей карточке `bg-card rounded-xl` и разделялись `divide-y`.
 * Рядом с карточками услуг, у которых нет ни фона, ни рамки, панель выглядела
 * чужеродной: сайдбар становился единственным обрамлённым блоком на холсте.
 * Теперь группы разделяет воздух — `space-y-6` на родителе
 * (`CategorySidebar`, `TasksSidebar`), а сама группа рисует только заголовок
 * и список.
 *
 * Отсюда и отступы. Своего `px-*` у строк нет: без панели список должен
 * стоять по левому краю колонки, вровень с сеткой карточек справа. Подсветка
 * при наведении выходит за текст на 8px в обе стороны (`-mx-2 px-2`) —
 * так заливка остаётся заметной мишенью, а текст не съезжает.
 *
 * Следствие для шторки фильтров на телефоне: боковые отступы там теперь
 * задаёт вызывающая страница (`px-4` на теле шторки), потому что у самой
 * `SheetContent` их нет, а раньше их невольно давал этот компонент.
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
      {/* `font-semibold` без разрядки (аудит 2026-09-29). Было
          `font-bold tracking-wider`: 700 делало заголовок группы самым
          жирным текстом страницы — тяжелее `h1`, который идёт 600. Разрядку
          ставят при прописных; на строчных «Исполнитель» и «Город» она
          читается как дефект набора. */}
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <div>
        {options.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            scroll={false}
            aria-current={option.active ? "true" : undefined}
            className={`flex items-center gap-2.5 -mx-2 px-2 py-1.5 rounded-lg text-sm leading-snug transition-colors hover:bg-muted/40 ${
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
                уже даёт aria-current выше, кружок — чисто декоративный.

                12px с рамкой 1.5px, а не 14px с 2px (2026-09-29): в панели
                кружок держался наравне с её рамкой, на голом холсте он стал
                самой тяжёлой деталью сайдбара. Оставлен, а не убран: фильтры
                одиночного выбора, и кружок сообщает «можно выбрать одно» —
                без него состояние держалось бы только на цвете и начертании. */}
            <span
              aria-hidden="true"
              className={`flex items-center justify-center size-3 rounded-full border-[1.5px] flex-shrink-0 ${
                option.active ? "border-state" : "border-border"
              }`}
            >
              {option.active && <span className="size-1.5 rounded-full bg-state" />}
            </span>
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
