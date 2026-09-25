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
 * Кружок 36px в 8px от верхнего и правого края снимка. Заливка белая на 90%
 * с лёгким размытием подложки (2px — именно лёгким, не матовым стеклом),
 * почти незаметная белая обводка 1px и очень мягкая тень. Сердечко 20px,
 * контурное, толщина штриха 1.75, нейтральный тёмно-серый.
 *
 * Задача сформулирована так: кнопка должна быть лёгкой и не выглядеть тяжелее
 * самого товара. Поэтому здесь нет ни жирной обводки, ни заметной тени,
 * ни крупного красного сердца — отметка читается, но карточку не перебивает.
 *
 * **Сохранённое состояние отличается формой, а не только цветом:** сердечко
 * становится залитым и меняет цвет на `--brand`. Размер, фон и обводка
 * остаются теми же — меняется только сама иконка.
 *
 * Замеры при 90%, норма для значимой графики 3:1. Худший случай — чёрный
 * снимок, лучший — белый:
 * - несохранённое `--secondary` `#5B6468`: 4.8:1 … 6.1:1;
 * - сохранённое `--brand` `#8A6A00`: 4.0:1 … 5.1:1.
 *
 * Норма держится на любой фотографии, и это заслуга именно 90%: на 70%,
 * которые здесь стояли часом раньше, сохранённое сердечко падало до 2.4:1
 * на тёмных снимках, и границу приходилось вытягивать обводкой в цвет
 * сердечка. Плотная заливка сняла эту нужду, и обводка стала тем, чем должна
 * быть, — почти невидимым краем.
 */
const OVERLAY_CHIP =
  "flex size-9 items-center justify-center rounded-full border border-white/70 bg-white/90 backdrop-blur-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";
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

  // Кружок и его обводка одни и те же в обоих состояниях; меняется только
  // сердечко — цветом и заливкой. `--secondary` вместо `--muted-foreground`:
  // нужен нейтральный серый, а у второго есть чернильный оттенок 294°.
  const heartTone = (saved: boolean) =>
    overlay
      ? saved
        ? "fill-brand text-brand"
        : "text-secondary"
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
        className={cn("relative tap-target", buttonBase, className)}
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
        className={cn("relative tap-target cursor-pointer", buttonBase, className)}
      >
        <Heart
          className={cn(iconBase, "transition-colors", heartTone(optimistic))}
          strokeWidth={strokeWidth}
        />
      </button>
    </form>
  );
}
