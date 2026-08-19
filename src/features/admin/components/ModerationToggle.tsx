"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { setServiceModeration, setTaskModeration } from "@/features/admin/actions";
import { type ActionState, idleState } from "@/lib/action-state";

interface ModerationToggleProps {
  /** Что модерируем. Дискриминант + id, как у раскрытия контактов и избранного. */
  target: { kind: "service"; id: number } | { kind: "task"; id: number };
  /** Текущее состояние модерации объявления. */
  isBlocked: boolean;
}

/**
 * Скрыть объявление или вернуть его в каталог.
 *
 * Меняет только `moderationStatus`. Флаг владельца (`isActive` у услуги,
 * `status` у задания) администратор не трогает — иначе владелец смог бы снять
 * наложенное модератором скрытие.
 */
export function ModerationToggle({ target, isBlocked }: ModerationToggleProps) {
  const action = target.kind === "service" ? setServiceModeration : setTaskModeration;
  const [state, formAction, pending] = useActionState<ActionState<void>, FormData>(
    action,
    idleState,
  );

  return (
    <form action={formAction} className="contents">
      <input type="hidden" name="id" value={target.id} />
      <input type="hidden" name="status" value={isBlocked ? "approved" : "blocked"} />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={pending}
        title={isBlocked ? "Вернуть в каталог" : "Скрыть из каталога"}
        aria-label={isBlocked ? "Вернуть в каталог" : "Скрыть из каталога"}
        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        {isBlocked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>
      {state.status === "error" && <span className="sr-only">{state.message}</span>}
    </form>
  );
}
