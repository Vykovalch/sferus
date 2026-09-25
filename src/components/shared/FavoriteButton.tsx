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
 * 2026-09-25). У несохранённого заливка белая на 50% — мягкое пятно внутри
 * контура; у сохранённого белым становится контур вокруг золотой заливки.
 * Белое в обоих состояниях есть, но в разных местах, и состояния остаются
 * несмешиваемыми.
 *
 * Работает это парой: на тёмном снимке отметку вытягивает светлое (заливка
 * или контур), на светлом — тёмное (контур `--secondary` или золотая
 * заливка). Норма для значимой графики 3:1, в таблице лучшая из границ:
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
 * Норма держится на всей шкале — впервые с тех пор, как кружок убрали. Без
 * заливки провал приходился ровно на середину: 1.5:1 и 1.3:1 на сером фоне,
 * то есть на самом обычном снимке.
 */
const OVERLAY_CHIP =
  "flex size-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";
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
        ? "fill-brand text-white"
        : "fill-white/50 text-secondary"
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
