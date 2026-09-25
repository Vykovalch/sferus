"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useOptimistic } from "react";
import { toggleFavorite } from "@/features/favorites/actions";
import type { FavoriteKind } from "@/features/favorites/schemas";
import { type ActionState, idleState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  /** Что отмечаем. Дискриминант + id, как у раскрытия контактов. */
  target: { kind: FavoriteKind; id: number };
  isFavorite: boolean;
  isAuthenticated: boolean;
  className?: string;
  /**
   * Размер самого сердечка. По умолчанию 14px — он подходит спискам и строкам.
   * Вариант `overlay` задаёт 24px сам.
   */
  iconClassName?: string;
  /**
   * `plain` — контурное сердечко на светлой поверхности: списки, строки,
   * шапка объявления. `overlay` — поверх фотографии, где цвет под отметкой
   * непредсказуем.
   */
  variant?: "plain" | "overlay";
}

/**
 * Как отметка выглядит поверх фотографии (спецификация владельца, 2026-09-25).
 *
 * Кружка не видно вовсе (решение владельца, 2026-09-25): ни заливки,
 * ни обводки, ни тени, ни размытия. От него осталась только коробка 36px —
 * она держит положение в 8px от верхнего и правого края снимка и центрирует
 * иконку; зона касания 44px приходит из `tap-target`. Сердечко прежнее:
 * 20px, контурное, штрих 1.75, `--secondary` в покое и залитое `--brand`
 * в сохранённом.
 *
 * **Читаемость держит само сердечко, а не подложка** (решение владельца,
 * 2026-09-25). Контур серый `--secondary` в обоих состояниях; меняется только
 * заливка — белая на 50% в покое, `--brand` у сохранённого.
 *
 * Норма для значимой графики 3:1, в таблице лучшая из границ:
 *
 * | фон под сердечком | несохранённое | сохранённое |
 * |---|---|---|
 * | чёрный | 5.3:1 | 4.1:1 |
 * | тёмно-серый `#2A2A2A` | 4.8:1 | **2.8:1** |
 * | средне-тёмный `#4A4A4A` | 3.6:1 | **1.8:1** |
 * | средний `#808080` | 3.3:1 | **1.5:1** |
 * | светлый `#E8E8E8` | 5.5:1 | 4.9:1 |
 * | белый | 6.1:1 | 6.1:1 |
 *
 * **Несохранённое проходит везде, сохранённое — нет.** Белая заливка на 50%
 * светлеет вместе с тёмным фоном и потому работает на всей шкале; сплошная
 * золотая — нет, а серый контур вокруг неё сам по себе тёмный и на тёмном
 * фоне не помогает. Полчаса здесь стоял белый контур у сохранённого, и тогда
 * проходила вся шкала (21:1 … 4.0:1), но владелец вернул серый: контур должен
 * быть одинаковым в обоих состояниях.
 *
 * Если провал подтвердится на живых фотографиях, закрыть его можно, не трогая
 * контур: дать сохранённому сердечку светлую подложку под золото.
 *
 * **Кружок возвращается только под курсором** (решения владельца,
 * 2026-09-25): при наведении проступает окружность 1px **в цвет обводки
 * сердечка** — серая в покое, белая у сохранённого. Это `ring`, а не
 * `border`: рамка добавила бы элементу ширину и сдвинула сердечко
 * на полпикселя в момент наведения, а кольцо рисуется тенью и на размер
 * не влияет.
 *
 * Цвет задан один раз на кнопке; сердечко, кольцо и обводка фокуса берут его
 * через `currentColor`. Разойтись они не могут.
 *
 * Требования 3:1 к кольцу нет: наведение — отклик на уже найденный элемент,
 * а не то, чем элемент опознают. Серое кольцо на тёмном снимке и белое
 * на светлом будут малозаметны, но отметку там держит само сердечко.
 * На телефоне наведения нет вовсе, и кнопка остаётся такой же, как в покое.
 */
const OVERLAY_CHIP =
  "flex size-9 items-center justify-center rounded-full ring-1 ring-transparent transition-[box-shadow] duration-150 ease-out hover:ring-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";
const OVERLAY_ICON = "size-5";

/**
 * Отметка «в избранном».
 *
 * Форма, а не кнопка с обработчиком: это мутация, и она обязана идти через
 * `authedAction` со всеми проверками. Поэтому карточка вокруг перестала быть
 * одной большой ссылкой — форма внутри `<a>` недопустима, да и кнопка внутри
 * ссылки была невалидной вложенностью.
 *
 * Отметка закрашивается сразу, не дожидаясь ответа: `useOptimistic` держит
 * значение, пока идёт переход, а по его завершении откатывается к базовому.
 * Базовое — это ответ сервера, если он уже пришёл, иначе проп со страницы.
 * Поэтому при отказе отметка возвращается в исходное состояние сама.
 *
 * Сама отметка мелкая (22–32px), зона касания — 44×44 через `tap-target`
 * (globals.css) во всех местах сразу. `relative` в базовых классах нужен
 * псевдоэлементу; `absolute` из `className` его перебивает.
 */
export function FavoriteButton({
  target,
  isFavorite,
  isAuthenticated,
  className,
  iconClassName = "h-3.5 w-3.5",
  variant = "plain",
}: FavoriteButtonProps) {
  const overlay = variant === "overlay";
  const iconBase = overlay ? OVERLAY_ICON : iconClassName;
  const buttonBase = overlay ? OVERLAY_CHIP : "transition-colors";
  const [state, formAction] = useActionState<ActionState<{ isFavorite: boolean }>, FormData>(
    toggleFavorite,
    idleState,
  );

  const confirmed = state.status === "success" ? state.data.isFavorite : isFavorite;
  const [optimistic, setOptimistic] = useOptimistic(confirmed);

  // Только путь, без query: `useSearchParams` требует Suspense-границы и
  // выводит маршрут из статического рендеринга. Возврат после входа теряет
  // фильтры каталога — цена приемлемая, страница та же.
  const pathname = usePathname();

  // Цвет обводки сердечка задан на кнопке, а не на иконке: сердечко берёт его
  // через `currentColor`, и тем же цветом рисуется кольцо при наведении
  // (`hover:ring-current`) и обводка при фокусе. Так они не могут разойтись —
  // цвет один на три места.
  //
  // `--secondary` вместо `--muted-foreground`: нужен нейтральный серый,
  // а у второго есть чернильный оттенок 294°.
  // Контур серый в обоих состояниях (решение владельца, 2026-09-25): меняется
  // только заливка. Белый контур у сохранённого стоял полчаса и был убран.
  const chipTone = "text-secondary";
  // Заливка — единственное, что задаётся на самой иконке.
  const heartTone = (saved: boolean) =>
    overlay
      ? saved
        ? "fill-brand"
        : "fill-white/50"
      : saved
        ? "fill-brand text-brand"
        : "text-muted-foreground";
  // Штрих 1.75 вместо стандартных 2: на 20px контур тоньше и аккуратнее,
  // но не теряется на пёстрых снимках.
  const strokeWidth = overlay ? 1.75 : undefined;

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
        aria-label="Войдите, чтобы добавить в избранное"
        className={cn("relative tap-target", buttonBase, overlay && chipTone, className)}
      >
        <Heart className={cn(iconBase, heartTone(false))} strokeWidth={strokeWidth} />
      </Link>
    );
  }

  return (
    <form
      action={(formData) => {
        setOptimistic(!optimistic);
        formAction(formData);
      }}
      className="contents"
    >
      <input type="hidden" name="kind" value={target.kind} />
      <input type="hidden" name="id" value={target.id} />
      <button
        type="submit"
        aria-pressed={optimistic}
        aria-label={optimistic ? "Убрать из избранного" : "Добавить в избранное"}
        className={cn(
          "relative tap-target cursor-pointer",
          buttonBase,
          overlay && chipTone,
          className,
        )}
      >
        <Heart
          className={cn(iconBase, "transition-colors", heartTone(optimistic))}
          strokeWidth={strokeWidth}
        />
      </button>
    </form>
  );
}
