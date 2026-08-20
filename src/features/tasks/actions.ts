"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTaskOwner } from "@/features/tasks/queries";
import {
  changeTaskStatusSchema,
  createTaskSchema,
  updateTaskSchema,
} from "@/features/tasks/schemas";
import { ActionError, authedAction, ForbiddenError, NotFoundError } from "@/lib/action-client";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";

/**
 * Мутации заданий.
 *
 * Каждый экспорт отсюда — публичный HTTP-эндпоинт, доступный прямым POST-запросом,
 * а не только через форму на странице. `authedAction` закрывает проверку сессии
 * и валидацию входа; проверка прав на конкретный объект остаётся здесь, в теле
 * обработчика, и обобщению не подлежит.
 */

export const createTask = authedAction(createTaskSchema, async (input, { userId }) => {
  const [created] = await db
    .insert(tasks)
    .values({
      userId,
      title: input.title,
      description: input.description,
      budget: input.budget,
      isNegotiable: input.isNegotiable,
      categoryId: input.categoryId,
      cityId: input.cityId,
    })
    .returning({ id: tasks.id });

  revalidatePath("/tasks");
  revalidatePath("/dashboard/tasks");

  redirect(`/tasks/${created.id}`);
});

export const updateTask = authedAction(updateTaskSchema, async (input, { userId }) => {
  const existing = await getTaskOwner(input.id);
  if (!existing) throw new NotFoundError("Задание не найдено");
  if (existing.userId !== userId) throw new ForbiddenError();

  await db
    .update(tasks)
    .set({
      title: input.title,
      description: input.description,
      budget: input.budget,
      isNegotiable: input.isNegotiable,
      categoryId: input.categoryId,
      cityId: input.cityId,
    })
    .where(eq(tasks.id, input.id));

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${input.id}`);
  revalidatePath("/dashboard/tasks");

  redirect("/dashboard/tasks");
});

/**
 * Смена статуса задания владельцем: закрыть как выполненное или отменить.
 * Из `open` в `completed`/`cancelled` — оба состояния финальные, обратного
 * перехода в v1 нет: возврат «отменённого» задания в работу не предусмотрен
 * моделью (ROADMAP, после v1 — отклики появятся вместе с полноценным
 * жизненным циклом).
 */
export const changeTaskStatus = authedAction(changeTaskStatusSchema, async (input, { userId }) => {
  const existing = await getTaskOwner(input.id);
  if (!existing) throw new NotFoundError("Задание не найдено");
  if (existing.userId !== userId) throw new ForbiddenError();

  // Условие `status = 'open'` в самом UPDATE, а не отдельной проверкой перед ним:
  // так переход остаётся необратимым даже при двух одновременных запросах,
  // и не нужен лишний SELECT. Интерфейс кнопок для завершённых заданий не
  // показывает — но действие доступно прямым запросом в обход интерфейса.
  const updated = await db
    .update(tasks)
    .set({ status: input.status })
    .where(and(eq(tasks.id, input.id), eq(tasks.status, "open")))
    .returning({ id: tasks.id });

  if (updated.length === 0) {
    throw new ActionError("Задание уже завершено или отменено — статус не меняется");
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${input.id}`);
  revalidatePath("/dashboard/tasks");
});
