"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { changeTaskStatus } from "@/features/tasks/actions";
import { type ActionState, idleState } from "@/lib/action-state";

interface TaskStatusActionsProps {
  taskId: number;
}

/** Кнопки «Завершить» / «Отменить» — только пока задание открыто, оба перехода финальные. */
export function TaskStatusActions({ taskId }: TaskStatusActionsProps) {
  const [completeState, completeAction, completePending] = useActionState<
    ActionState<void>,
    FormData
  >(changeTaskStatus, idleState);
  const [cancelState, cancelAction, cancelPending] = useActionState<ActionState<void>, FormData>(
    changeTaskStatus,
    idleState,
  );

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <form action={completeAction}>
        <input type="hidden" name="id" value={taskId} />
        <input type="hidden" name="status" value="completed" />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={completePending || cancelPending}
          title="Отметить выполненным"
          aria-label="Отметить выполненным"
          className="h-8 w-8 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
        {completeState.status === "error" && (
          <span className="sr-only">{completeState.message}</span>
        )}
      </form>
      <form action={cancelAction}>
        <input type="hidden" name="id" value={taskId} />
        <input type="hidden" name="status" value="cancelled" />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={completePending || cancelPending}
          title="Отменить задание"
          aria-label="Отменить задание"
          className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
        >
          <XCircle className="h-4 w-4" />
        </Button>
        {cancelState.status === "error" && <span className="sr-only">{cancelState.message}</span>}
      </form>
    </div>
  );
}
