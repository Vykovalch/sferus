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
}

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
 */
export function FavoriteButton({
  target,
  isFavorite,
  isAuthenticated,
  className,
}: FavoriteButtonProps) {
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

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
        aria-label="Войдите, чтобы добавить в избранное"
        className={cn("transition-colors", className)}
      >
        <Heart className="h-3.5 w-3.5 text-muted-foreground" />
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
        className={cn("transition-colors cursor-pointer", className)}
      >
        <Heart
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            optimistic ? "fill-brand text-brand" : "text-muted-foreground",
          )}
        />
      </button>
    </form>
  );
}
