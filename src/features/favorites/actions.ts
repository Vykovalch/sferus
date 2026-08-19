"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getFavoriteId } from "@/features/favorites/queries";
import { toggleFavoriteSchema } from "@/features/favorites/schemas";
import { getServiceOwner } from "@/features/services/queries";
import { getTaskOwner } from "@/features/tasks/queries";
import { authedAction, NotFoundError } from "@/lib/action-client";
import { db } from "@/lib/db";
import { favorites } from "@/lib/db/schema";

/**
 * Мутации избранного.
 *
 * Проверка прав на объект отдельной строкой не нужна и не пропущена: строка
 * избранного принадлежит текущему пользователю по построению — `userId`
 * берётся из сессии и в форму не передаётся. Своё объявление добавить можно:
 * запрет ничего не защищал бы.
 */

/** Существует ли объявление вообще — иначе вместо понятной ошибки прилетит нарушение FK. */
async function targetExists(kind: "service" | "task", id: number) {
  const target = kind === "service" ? await getServiceOwner(id) : await getTaskOwner(id);
  return target !== null;
}

/**
 * Переключение отметки «в избранном».
 *
 * Возвращает фактическое состояние после операции: клиент рисует отметку
 * оптимистично, и ответ сервера — то, к чему он приходит, когда переход
 * завершается.
 *
 * `onConflictDoNothing` страхует от гонки двойного клика: частичные уникальные
 * индексы `favorites_user_service_uq` и `favorites_user_task_uq` не дадут
 * появиться второй строке, и повторная вставка не станет ошибкой.
 */
export const toggleFavorite = authedAction(toggleFavoriteSchema, async (input, { userId }) => {
  if (!(await targetExists(input.kind, input.id))) {
    throw new NotFoundError("Объявление не найдено");
  }

  const existingId = await getFavoriteId(userId, input.kind, input.id);

  if (existingId !== null) {
    await db.delete(favorites).where(eq(favorites.id, existingId));
  } else {
    await db
      .insert(favorites)
      .values({
        userId,
        serviceId: input.kind === "service" ? input.id : null,
        taskId: input.kind === "task" ? input.id : null,
      })
      .onConflictDoNothing();
  }

  revalidatePath("/dashboard/favorites");

  return { isFavorite: existingId === null };
});
