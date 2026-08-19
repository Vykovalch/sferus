"use client";

import { Ban, CheckCircle2 } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { setUserBan } from "@/features/admin/actions";
import { type ActionState, idleState } from "@/lib/action-state";

interface UserBanToggleProps {
  userId: string;
  isBanned: boolean;
}

/**
 * Блокировка пользователя.
 *
 * Для самого администратора кнопка не рендерится — страница её не показывает.
 * Проверка на сервере всё равно есть: кнопки нет в разметке, но действие
 * остаётся публичным эндпоинтом.
 */
export function UserBanToggle({ userId, isBanned }: UserBanToggleProps) {
  const [state, formAction, pending] = useActionState<ActionState<void>, FormData>(
    setUserBan,
    idleState,
  );

  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="banned" value={isBanned ? "false" : "true"} />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={pending}
        title={isBanned ? "Разблокировать" : "Заблокировать"}
        aria-label={isBanned ? "Разблокировать пользователя" : "Заблокировать пользователя"}
        className={`h-8 w-8 cursor-pointer flex-shrink-0 ${
          isBanned
            ? "text-muted-foreground hover:text-foreground"
            : "text-muted-foreground hover:text-destructive"
        }`}
      >
        {isBanned ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
      </Button>
      {state.status === "error" && <span className="sr-only">{state.message}</span>}
    </form>
  );
}
