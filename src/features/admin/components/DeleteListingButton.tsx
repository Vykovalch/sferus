"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteService, deleteTask } from "@/features/admin/actions";
import { type ActionState, idleState } from "@/lib/action-state";

interface DeleteListingButtonProps {
  target: { kind: "service"; id: number } | { kind: "task"; id: number };
  title: string;
}

/**
 * Удаление объявления администратором — только с подтверждением.
 *
 * Операция необратима и каскадом вычищает объявление из избранного у всех
 * пользователей, поэтому одного клика для неё мало. Диалог заодно называет
 * обратимую альтернативу: почти всегда нужен не `DELETE`, а «Скрыть».
 */
export function DeleteListingButton({ target, title }: DeleteListingButtonProps) {
  const [open, setOpen] = useState(false);
  const action = target.kind === "service" ? deleteService : deleteTask;
  const [state, formAction, pending] = useActionState<ActionState<void>, FormData>(
    action,
    idleState,
  );

  const noun = target.kind === "service" ? "Объявление" : "Задание";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          title="Удалить безвозвратно"
          aria-label="Удалить безвозвратно"
          className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить безвозвратно?</DialogTitle>
          <DialogDescription>
            «{title}» будет удалено вместе с фотографиями и исчезнет из избранного у всех
            пользователей. Отменить это нельзя. Чтобы просто убрать {noun.toLowerCase()} из
            каталога, используйте «Скрыть» — это обратимо.
          </DialogDescription>
        </DialogHeader>

        {state.status === "error" && (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            Отмена
          </Button>
          <form action={formAction}>
            <input type="hidden" name="id" value={target.id} />
            <Button
              type="submit"
              variant="destructive"
              disabled={pending}
              className="cursor-pointer"
            >
              {pending ? "Удаление…" : "Удалить"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
