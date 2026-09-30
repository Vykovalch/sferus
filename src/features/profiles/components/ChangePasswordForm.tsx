"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/features/profiles/actions";
import { type ActionState, idleState } from "@/lib/action-state";

interface PasswordFieldProps {
  /** Служит и `id`, и `name`: имена полей формы совпадают с ключами схемы. */
  id: string;
  label: string;
  autoComplete: string;
  placeholder: string;
  minLength?: number;
  error?: string;
}

/**
 * Поле пароля с кнопкой показа символов.
 *
 * Приём тот же, что на экранах входа и регистрации: кнопка внутри поля справа,
 * `Eye` / `EyeOff` 16px, подпись меняется вместе с состоянием. `type="button"`
 * обязателен — иначе кнопка отправляла бы форму.
 *
 * Видимость живёт в самом поле, а не в форме: три поля показываются
 * и скрываются независимо, как пароль и его подтверждение на регистрации.
 */
function PasswordField({
  id,
  label,
  autoComplete,
  placeholder,
  minLength,
  error,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

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
  // Счётчик успешных смен меняет `key` полей: они пересоздаются, и вместе
  // со значением сбрасывается показ символов. Иначе поле осталось бы
  // открытым — пустым, но открытым.
  const [resetCount, setResetCount] = useState(0);

  // Очистка — побочный эффект, а не часть рендера: оставлять введённые пароли
  // в полях после успешной смены незачем.
  //
  // Зависимость от всего `state`, а не от `state.status`: `useActionState`
  // отдаёт новый объект на каждый ответ, а статус двух успешных смен подряд
  // один и тот же — по `state.status` вторая очистка не сработала бы.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setResetCount((count) => count + 1);
    }
  }, [state]);

  const errorMessage = state.status === "error" ? state.message : null;
  const fieldError = (field: string) =>
    state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
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

      <PasswordField
        key={`currentPassword-${resetCount}`}
        id="currentPassword"
        label="Текущий пароль"
        autoComplete="current-password"
        placeholder="••••••••"
        error={fieldError("currentPassword")}
      />

      <PasswordField
        key={`newPassword-${resetCount}`}
        id="newPassword"
        label="Новый пароль"
        autoComplete="new-password"
        placeholder="Минимум 8 символов"
        minLength={8}
        error={fieldError("newPassword")}
      />

      <PasswordField
        key={`confirmPassword-${resetCount}`}
        id="confirmPassword"
        label="Подтвердите пароль"
        autoComplete="new-password"
        placeholder="Повторите пароль"
        error={fieldError("confirmPassword")}
      />

      <Button
        type="submit"
        disabled={pending}
        className="h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground text-base font-medium cursor-pointer transition-colors"
      >
        {pending ? "Сохранение…" : "Изменить пароль"}
      </Button>
    </form>
  );
}
