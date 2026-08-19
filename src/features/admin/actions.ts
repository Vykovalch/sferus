"use server";

import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  deleteListingSchema,
  setModerationSchema,
  setUserBanSchema,
} from "@/features/admin/schemas";
import {
  type ActionContext,
  ActionError,
  authedAction,
  ForbiddenError,
  NotFoundError,
} from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { services, tasks } from "@/lib/db/schema";

/**
 * Мутации админки.
 *
 * `authedAction` знает только, что пользователь вошёл, — роль он не проверяет.
 * Поэтому `requireAdmin` стоит **явной первой строкой** каждого обработчика,
 * а не спрятан в обёртку с параметром: пропущенную строку в теле видно
 * на ревью, забытый флаг конфигурации — нет. Ровно тот же довод, по которому
 * не обобщается проверка владения (см. JSDoc `authedAction`).
 *
 * Админка меняет только `moderationStatus`. Трогать `isActive` нельзя:
 * это переключатель владельца, и, записывая в него, администратор дал бы
 * пользователю возможность снять наложенное модератором скрытие
 * (DATA-MODEL.md, два независимых флага видимости).
 */

function requireAdmin(ctx: ActionContext) {
  if (ctx.session.user.role !== "admin") {
    throw new ForbiddenError("Действие доступно только администратору");
  }
}

/** Публичные страницы, которые обязаны сразу забыть скрытое объявление. */
function revalidateServiceLists() {
  revalidatePath("/admin/listings");
  revalidatePath("/services");
  revalidatePath("/");
}

function revalidateTaskLists() {
  revalidatePath("/admin/tasks");
  revalidatePath("/tasks");
}

export const setServiceModeration = authedAction(setModerationSchema, async (input, ctx) => {
  requireAdmin(ctx);

  const updated = await db
    .update(services)
    .set({ moderationStatus: input.status })
    .where(eq(services.id, input.id))
    .returning({ id: services.id });

  if (updated.length === 0) throw new NotFoundError("Объявление не найдено");

  revalidateServiceLists();
});

/**
 * Физическое удаление услуги.
 *
 * Каскад уносит фотографии и записи в чужом избранном — это и есть желаемое
 * поведение для спама и противоправного контента, где содержимое обязано
 * исчезнуть везде. Для всего остального существует обратимое «Скрыть».
 */
export const deleteService = authedAction(deleteListingSchema, async (input, ctx) => {
  requireAdmin(ctx);

  const deleted = await db
    .delete(services)
    .where(eq(services.id, input.id))
    .returning({ id: services.id });

  if (deleted.length === 0) throw new NotFoundError("Объявление не найдено");

  revalidateServiceLists();
});

export const setTaskModeration = authedAction(setModerationSchema, async (input, ctx) => {
  requireAdmin(ctx);

  const updated = await db
    .update(tasks)
    .set({ moderationStatus: input.status })
    .where(eq(tasks.id, input.id))
    .returning({ id: tasks.id });

  if (updated.length === 0) throw new NotFoundError("Задание не найдено");

  revalidateTaskLists();
});

/** Физическое удаление задания. Условия те же, что у услуги. */
export const deleteTask = authedAction(deleteListingSchema, async (input, ctx) => {
  requireAdmin(ctx);

  const deleted = await db.delete(tasks).where(eq(tasks.id, input.id)).returning({ id: tasks.id });

  if (deleted.length === 0) throw new NotFoundError("Задание не найдено");

  revalidateTaskLists();
});

/**
 * Блокировка и разблокировка пользователя.
 *
 * Через API плагина `admin`, а не прямой записью в таблицу `user`: бан не
 * сводится к колонке — плагин заодно удаляет все сессии пользователя, поэтому
 * заблокированный вылетает немедленно, а не при следующем входе. Прямой
 * `UPDATE` оставил бы его работать до истечения сессии.
 *
 * Плагин проверяет роль администратора у себя, то есть проверка двойная.
 * Самоблокировку он тоже запрещает, но своя проверка стоит раньше — чтобы
 * пользователь увидел понятное сообщение, а не общую ошибку.
 *
 * Объявления заблокированного остаются опубликованными: бан закрывает вход,
 * но не прячет содержимое. Скрывать их нужно поштучно на других вкладках
 * админки — см. «Известные проблемы», пункт 20.
 */
export const setUserBan = authedAction(setUserBanSchema, async (input, ctx) => {
  requireAdmin(ctx);

  if (input.userId === ctx.userId) {
    throw new ActionError("Нельзя заблокировать собственную учётную запись");
  }

  const requestHeaders = await headers();

  try {
    if (input.banned) {
      await auth.api.banUser({ body: { userId: input.userId }, headers: requestHeaders });
    } else {
      await auth.api.unbanUser({ body: { userId: input.userId }, headers: requestHeaders });
    }
  } catch (error) {
    // Тексты better-auth английские и рассчитаны на API — наружу не отдаём.
    if (error instanceof APIError) {
      throw new ActionError("Не удалось изменить доступ пользователя");
    }
    throw error;
  }

  revalidatePath("/admin/users");
});
