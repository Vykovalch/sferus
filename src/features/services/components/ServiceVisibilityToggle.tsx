"use client";

import { Power, PowerOff } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { toggleServiceActive } from "@/features/services/actions";
import { type ActionState, idleState } from "@/lib/action-state";

interface ServiceVisibilityToggleProps {
  serviceId: number;
  isActive: boolean;
}

/** Включение и выключение объявления владельцем. Модерации не касается. */
export function ServiceVisibilityToggle({ serviceId, isActive }: ServiceVisibilityToggleProps) {
  const [state, formAction, pending] = useActionState<ActionState<void>, FormData>(
    toggleServiceActive,
    idleState,
  );

  return (
    <form action={formAction} className="flex-shrink-0">
      <input type="hidden" name="id" value={serviceId} />
      <input type="hidden" name="isActive" value={isActive ? "false" : "true"} />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        disabled={pending}
        title={isActive ? "Скрыть объявление" : "Опубликовать объявление"}
        aria-label={isActive ? "Скрыть объявление" : "Опубликовать объявление"}
        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        {isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
      </Button>
      {state.status === "error" && <span className="sr-only">{state.message}</span>}
    </form>
  );
}
