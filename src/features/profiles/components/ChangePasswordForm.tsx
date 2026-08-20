"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/features/profiles/actions";
import { type ActionState, idleState } from "@/lib/action-state";

/**
 * Смена пароля в кабинете.
 *
 * Поля неуправляемые: пароль незачем держать в состоянии React дольше, чем
 * нужно для отправки, а после успеха форма очищается через `reset()`.
 */
export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<ActionState<void>, FormData>(
    changePassword,
    idleState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  // Очистка — побочный эффект, а не часть рендера: оставлять введённые пароли
  // в полях после успешной смены незачем.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  const errorMessage = state.status === "error" ? state.message : null;
  const fieldError = (field: string) =>
    state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {errorMessage}
        </div>
      )}

      {state.status === "success" && (
        <output className="block p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-foreground text-sm">
          Пароль изменён
        </output>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Текущий пароль</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          aria-invalid={Boolean(fieldError("currentPassword"))}
        />
        {fieldError("currentPassword") && (
          <p className="text-xs text-destructive">{fieldError("currentPassword")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">Новый пароль</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Минимум 8 символов"
          aria-invalid={Boolean(fieldError("newPassword"))}
        />
        {fieldError("newPassword") && (
          <p className="text-xs text-destructive">{fieldError("newPassword")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Повторите пароль"
          aria-invalid={Boolean(fieldError("confirmPassword"))}
        />
        {fieldError("confirmPassword") && (
          <p className="text-xs text-destructive">{fieldError("confirmPassword")}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer"
      >
        {pending ? "Сохранение…" : "Изменить пароль"}
      </Button>
    </form>
  );
}
