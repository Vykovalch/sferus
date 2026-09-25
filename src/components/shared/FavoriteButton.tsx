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
 * **В покое кружка не видно вовсе:** ни заливки, ни обводки, ни тени,
 * ни размытия. От него остаётся коробка 32px — она держит положение в 8px
 * от верхнего и правого края снимка и центрирует иконку; зона касания 44px
 * приходит из `tap-target` и от визуального размера не зависит. Сердечко:
 * 20px, штрих 1.75, контур `--secondary` и заливка белая на 50% в покое,
 * заливка `--brand` и белый контур в сохранённом.
 *
 * **32, а не 36** (решение владельца, 2026-09-25). Замеры живых витрин
 * 2026-09-25: Booking — кнопка 36px с иконкой 16px, Airbnb — 32px с иконкой
 * 24px, Ozon — 24px с иконкой 16px. Единого размера у отрасли нет, есть два
 * подхода: мелкий кружок с мелкой иконкой или крупная иконка почти без полей.
 * Решает не размер коробки, а воздух вокруг иконки: у Airbnb и Ozon это 4px,
 * у нас при 36px было 8px — отсюда и ощущение простора под курсором.
 * При 32px остаётся 6px.
 *
 * **Читаемость держит само сердечко, а не подложка** (решение владельца,
 * 2026-09-25). Белое есть в обоих состояниях, но в разных местах: в покое это
 * заливка на 50% внутри серого контура, у сохранённого — белый контур вокруг
 * золотой заливки. Состояния от этого не смешиваются, а слабые места
 * закрывают друг друга: на тёмном снимке отметку вытягивает светлое,
 * на светлом — тёмное.
 *
 * Норма для значимой графики 3:1, в таблице лучшая из границ:
 *
 * | фон под сердечком | несохранённое | сохранённое |
 * |---|---|---|
 * | чёрный | 5.3:1 | 21:1 |
 * | тёмно-серый `#2A2A2A` | 4.8:1 | 14.4:1 |
 * | средне-тёмный `#4A4A4A` | 3.6:1 | 8.9:1 |
 * | средний `#808080` | 3.3:1 | 4.0:1 |
 * | светлый `#E8E8E8` | 5.5:1 | 4.1:1 |
 * | белый | 6.1:1 | 5.1:1 |
 *
 * **Серый контур у сохранённого пробовали в тот же день и вернули белый.**
 * С серым сохранённая отметка давала 1.5:1 на обычном сером снимке и 1.8:1
 * на средне-тёмном: человек добавлял услугу в избранное, возвращался
 * и не видел, что она отмечена.
 *
 * **Кружок возвращается только под курсором** (решения владельца,
 * 2026-09-25): при наведении проступают окружность 1px **в цвет обводки
 * сердечка** — серая в покое, белая у сохранённого — и заливка кружка белым
 * на 80%. Кольцо — это `ring`, а не `border`: рамка добавила бы элементу
 * ширину и сдвинула сердечко на полпикселя в момент наведения, а кольцо
 * рисуется тенью и на размер не влияет.
 *
 * 80%, а не 50%: на полупрозрачном кружке сердечко почти не отделялось
 * от своей подложки — серый контур давал 1.5:1 на тёмном снимке, золото 1.3:1.
 * На 80% кружок под курсором выглядит настоящим, и внутри него всё проходит
 * норму: серый контур 3.8:1 … 6.1:1, золото 3.2:1 … 5.1:1. Значение то же,
 * что владелец выбрал для постоянного кружка, пока тот ещё был.
 *
 * Сердечко под курсором читается контуром, а не заливкой: его белые 50%
 * ложатся поверх белых 80% кружка и почти сливаются с ними. Так и должно быть —
 * заливка сердечка нужна там, где подложки нет.
 *
 * Цвет контура задан один раз на кнопке; сердечко, кольцо и обводка фокуса
 * берут его через `currentColor` и разойтись не могут.
 *
 * Нормы 3:1 к состоянию наведения не предъявляем: это отклик на уже найденный
 * элемент, а не то, чем элемент опознают. На телефоне наведения нет вовсе,
 * и кнопка там всегда выглядит как в покое.
 */
const OVERLAY_CHIP =
  "flex size-8 items-center justify-center rounded-full ring-1 ring-transparent transition-[box-shadow,background-color] duration-150 ease-out hover:bg-white/80 hover:ring-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";
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
  // У сохранённого контур белый, у несохранённого серый (решение владельца,
  // 2026-09-25). Серый в обоих состояниях пробовали в тот же день и вернули
  // белый: с серым сохранённая отметка падала до 1.5:1 на обычном снимке.
  const chipTone = (saved: boolean) => (saved ? "text-white" : "text-secondary");
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
        className={cn("relative tap-target", buttonBase, overlay && chipTone(false), className)}
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
          overlay && chipTone(optimistic),
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
