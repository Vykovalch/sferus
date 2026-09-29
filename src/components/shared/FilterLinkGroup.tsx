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

/**
 * Сколько вариантов показывать сразу и с какой длины список вообще сворачивать.
 *
 * Порог выше предела на два: прятать один-два варианта за «Показать все» —
 * это лишнее нажатие ради ничего. Сейчас под свёртку попадает только список
 * категорий (21 строка вместе с «Все категории»); города (9) и типы
 * исполнителя (3) показываются целиком.
 */
const VISIBLE_LIMIT = 8;
const COLLAPSE_FROM = VISIBLE_LIMIT + 2;

function OptionLink({ option }: { option: FilterOption }) {
  return (
    <Link
      href={option.href}
      scroll={false}
      aria-current={option.active ? "true" : undefined}
      className={`flex items-center gap-2 -mx-2 px-2 py-1.5 rounded-lg text-sm leading-snug transition-colors hover:bg-muted/40 ${
        option.active
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {/* Визуальный радио-индикатор, не настоящий <input type="radio">:
          это ссылки-переходы (см. комментарий выше), а не поля формы,
          клавиатурная навигация стрелками для radiogroup тут не работает —
          поэтому без role="radio"/aria-checked, чтобы не обещать поведение,
          которого нет. Состояние для скринридеров уже даёт aria-current
          выше, кружок — чисто декоративный.

          Вид и размеры сняты с нативных радиокнопок на странице профиля
          (решение владельца, 2026-09-29): 16px, зазор 8px до подписи,
          кольцо `--input` в покое и золото `--brand` у выбранного — там это
          делает `accent-brand` на настоящем `<input type="radio">`. Так
          одинаковые по смыслу элементы выглядят одинаково в формах
          и в фильтрах.

          Оставлен, а не убран: фильтры одиночного выбора, и кружок сообщает
          «можно выбрать одно» — без него состояние держалось бы только
          на цвете и начертании. */}
      <span
        aria-hidden="true"
        className={`flex items-center justify-center size-4 rounded-full border-[1.5px] flex-shrink-0 ${
          option.active ? "border-brand" : "border-input"
        }`}
      >
        {option.active && <span className="size-2 rounded-full bg-brand" />}
      </span>
      {option.label}
    </Link>
  );
}

export function FilterLinkGroup({ title, options }: FilterLinkGroupProps) {
  const collapsed = options.length > COLLAPSE_FROM;
  const visibleOptions = collapsed ? options.slice(0, VISIBLE_LIMIT) : options;
  const hiddenOptions = collapsed ? options.slice(VISIBLE_LIMIT) : [];
  // Выбранный вариант не должен прятаться за «Показать все» — иначе человек
  // не видит, по чему отфильтровано. Список раскрыт с самого начала.
  const hasActiveHidden = hiddenOptions.some((option) => option.active);

  return (
    <div>
      {/* `font-semibold` без разрядки (аудит 2026-09-29). Было
          `font-bold tracking-wider`: 700 делало заголовок группы самым
          жирным текстом страницы — тяжелее `h1`, который идёт 600. Разрядку
          ставят при прописных; на строчных «Исполнитель» и «Город» она
          читается как дефект набора. */}
      {/* 16px, а не 14 (решение владельца, 2026-09-29): без панели заголовок
          группы шёл тем же кеглем, что пункты под ним, и группы читались одним
          сплошным списком. Теперь ступень видна: 16 заголовок, 14 варианты. */}
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <div>
        {visibleOptions.map((option) => (
          <OptionLink key={option.href} option={option} />
        ))}

        {/* Длинный список свёрнут (решение владельца, 2026-09-29). До этого
            все двадцать категорий стояли над группой «Город»: на десктопе
            это длинный сайдбар, а в шторке на телефоне до городов надо было
            пролистать весь рубрикатор. Так свёрнуты рубрикаторы у Avito,
            Ozon и Booking.

            `<details>`, а не состояние React: сворачивание остаётся частью
            разметки, компонент не становится клиентским, раскрытие работает
            без JS и с клавиатуры — `<summary>` фокусируется и открывается
            пробелом сам по себе. Прокрутку внутри группы не делаем: в шторке
            это прокрутка внутри прокрутки, палец не понимает, что листает. */}
        {hiddenOptions.length > 0 && (
          <details className="group" open={hasActiveHidden}>
            <summary className="-mx-2 mt-0.5 flex cursor-pointer list-none items-center rounded-lg px-2 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
              {/* Отступ слева равен ширине кружка и зазору у вариантов:
                  16 + 8 = 24px, чтобы подпись встала в ту же колонку. */}
              <span className="pl-6 group-open:hidden">Показать все ({options.length})</span>
              <span className="hidden pl-6 group-open:inline">Свернуть</span>
            </summary>
            {hiddenOptions.map((option) => (
              <OptionLink key={option.href} option={option} />
            ))}
          </details>
        )}
      </div>
    </div>
  );
}
