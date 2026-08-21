import "server-only";

import { headers } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { auth, type Session } from "@/lib/auth";
import { logError } from "@/lib/logger";

// Контракт состояния живёт в `action-state.ts`: этот модуль помечен `server-only`,
// а клиентским компонентам нужны те же типы и начальное значение.
export type { ActionState, FieldErrors } from "@/lib/action-state";

/* ────────────────────────── ошибки ────────────────────────── */

/**
 * Ошибка, текст которой можно показать пользователю.
 * Всё остальное, что вылетит из обработчика, заменяется общим сообщением:
 * подробности внутренних сбоев наружу не уходят.
 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

/** Пользователь не имеет прав на этот конкретный объект. */
export class ForbiddenError extends ActionError {
  constructor(message = "Недостаточно прав для этого действия") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Объект не найден — или не должен быть виден этому пользователю. */
export class NotFoundError extends ActionError {
  constructor(message = "Объект не найден") {
    super(message);
    this.name = "NotFoundError";
  }
}

const UNAUTHORIZED = "Требуется вход в аккаунт";
const INVALID_INPUT = "Проверьте правильность заполнения полей";
const INTERNAL = "Не удалось выполнить действие. Попробуйте позже";

/* ────────────────────────── разбор FormData ────────────────────────── */

/**
 * FormData → обычный объект для zod.
 *
 * Ключи с префиксом `$ACTION_` добавляет сам Next.js — в схему они попадать
 * не должны. Повторяющиеся ключи собираются в массив: так работают группы
 * чекбоксов и множественный выбор.
 */
function formDataToObject(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION_")) continue;

    if (key in result) {
      const previous = result[key];
      result[key] = Array.isArray(previous) ? [...previous, value] : [previous, value];
    } else {
      result[key] = value;
    }
  }

  return result;
}

/* ────────────────────────── обёртка ────────────────────────── */

export interface ActionContext {
  userId: string;
  session: Session;
}

/**
 * Оборачивает Server Action: проверка сессии → zod-валидация → обработчик.
 *
 * Каждый экспорт из `'use server'` файла — публичный HTTP-эндпоинт, доступный
 * прямым POST-запросом, а не только через форму. Обёртка существует, чтобы две
 * обязательные проверки нельзя было забыть.
 *
 * ВАЖНО: обёртка проверяет аутентификацию, но НЕ проверяет права на конкретный
 * объект — она знает, кто пришёл, но не знает, к чему он обращается. Проверка
 * владения остаётся явной строкой в теле каждого обработчика:
 *
 *     export const updateService = authedAction(schema, async (input, { userId }) => {
 *       const service = await getServiceOwner(input.id)
 *       if (!service) throw new NotFoundError()
 *       if (service.userId !== userId) throw new ForbiddenError()
 *       ...
 *     })
 *
 * Обобщать её нельзя сознательно: параметр конфигурации легко забыть и невозможно
 * заметить при ревью, а пропущенную строку в теле — видно.
 */
export function authedAction<TSchema extends z.ZodType, TData>(
  schema: TSchema,
  handler: (input: z.infer<TSchema>, ctx: ActionContext) => Promise<TData>,
) {
  return async (
    _prevState: ActionState<TData>,
    formData: FormData,
  ): Promise<ActionState<TData>> => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { status: "error", message: UNAUTHORIZED };
    }

    const parsed = schema.safeParse(formDataToObject(formData));
    if (!parsed.success) {
      const { fieldErrors, formErrors } = z.flattenError(parsed.error);
      return {
        status: "error",
        message: formErrors[0] ?? INVALID_INPUT,
        fieldErrors,
      };
    }

    try {
      const data = await handler(parsed.data, {
        userId: session.user.id,
        session,
      });
      return { status: "success", data };
    } catch (error) {
      // redirect() и notFound() бросают служебные исключения Next.js —
      // их нельзя проглатывать, иначе переход не произойдёт.
      unstable_rethrow(error);

      if (error instanceof ActionError) {
        return { status: "error", message: error.message };
      }

      // Ошибку видит только лог: наружу уходит общее сообщение, чтобы
      // подробности внутреннего сбоя не утекли пользователю.
      //
      // `userId` в контексте — не личные данные, а то, без чего разбор жалобы
      // невозможен: он позволяет найти запись по обращению конкретного человека.
      // Содержимое формы сюда не кладётся: там бывают контакты.
      logError("action", error, { userId: session.user.id });
      return { status: "error", message: INTERNAL };
    }
  };
}
