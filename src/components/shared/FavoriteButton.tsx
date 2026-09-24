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
 * Как отметка выглядит поверх фотографии (решение владельца, 2026-09-24).
 *
 * Кружок 32px, заливка белая на 70% с размытием подложки, обводка 1.5px —
 * **в цвет сердечка**, не белая. Сердечко 16px.
 *
 * Обводка здесь не украшение, а то, что позволило сделать заливку прозрачнее.
 * Раньше кружок был белым на 85% и без обводки, и всю границу держала одна
 * заливка. Владелец попросил её облегчить; просто убавить непрозрачность
 * было нельзя — сохранённое золотое сердечко на 85% стояло на 3.6:1 при норме
 * 3:1 для значимой графики. Обводка в цвет сердечка даёт вторую границу,
 * независимую от заливки, и запас появился.
 *
 * Замеры при 70%, норма 3:1:
 * - несохранённое `--muted-foreground`: к своей заливке 3.6:1 на чёрном
 *   снимке и 7.5:1 на белом;
 * - сохранённое `--brand`: к своей заливке 2.4:1 на чёрном снимке, но обводка
 *   того же цвета к самой фотографии — 4.1:1. На тёмном снимке отметку держит
 *   обводка, на светлом — сердечко.
 *
 * Самое слабое место — снимок средней светлоты: там обводка к фотографии
 * 1.9:1 и 1.3:1, и работает только сердечко внутри (5.3:1 и 3.6:1).
 * Поднять заливку до 80% — один символ, если на живых фотографиях
 * не понравится.
 */
const OVERLAY_CHIP =
  "flex size-8 items-center justify-center rounded-full border-[1.5px] bg-white/70 backdrop-blur-sm transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2";
const OVERLAY_ICON = "size-4";

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

  // Цвет обводки и сердечка — один и тот же, поэтому он задан на кружке,
  // а сердечко берёт его через `currentColor`.
  const overlayTone = (saved: boolean) =>
    saved
      ? "border-brand text-brand focus-visible:outline-brand"
      : "border-muted-foreground text-muted-foreground focus-visible:outline-muted-foreground";

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
        aria-label="Войдите, чтобы добавить в избранное"
        className={cn("relative tap-target", buttonBase, overlay && overlayTone(false), className)}
      >
        <Heart className={cn(iconBase, !overlay && "text-muted-foreground")} />
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
          overlay && overlayTone(optimistic),
          className,
        )}
      >
        <Heart
          className={cn(
            iconBase,
            "transition-colors",
            overlay
              ? optimistic && "fill-current"
              : optimistic
                ? "fill-brand text-brand"
                : "text-muted-foreground",
          )}
        />
      </button>
    </form>
  );
}
