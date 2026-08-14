"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getVisibleContacts, type VisibleContact } from "@/features/profiles/queries";
import { getServiceOwner } from "@/features/services/queries";
import { getTaskOwner } from "@/features/tasks/queries";
import { auth } from "@/lib/auth";

const revealSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type RevealResult =
  | { status: "ok"; contacts: VisibleContact[] }
  | { status: "unauthorized" }
  | { status: "not-found" };

/**
 * Контакты владельца услуги — по явному действию авторизованного пользователя.
 *
 * Не через `authedAction`: это не отправка формы, а чтение по нажатию кнопки,
 * возвращающее данные, а не состояние формы. Обязательная проверка сессии
 * поэтому стоит здесь явной строкой.
 *
 * Ключевое: контакты никогда не попадают в разметку страницы. Они уходят
 * клиенту только этим вызовом и только после проверки сессии — иначе их можно
 * было бы прочитать в исходном коде, не нажимая кнопку.
 */
export async function revealServiceContacts(serviceId: number): Promise<RevealResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { status: "unauthorized" };

  const parsed = revealSchema.safeParse({ id: serviceId });
  if (!parsed.success) return { status: "not-found" };

  const service = await getServiceOwner(parsed.data.id);
  if (!service) return { status: "not-found" };

  const contacts = await getVisibleContacts(service.userId);
  return { status: "ok", contacts };
}

/**
 * Контакты автора задания — тот же механизм, что и у услуг: раскрытие
 * заменяет отклики в v1 (см. ROADMAP.md, 1.3) — единственный способ связи
 * между пользователями без внутреннего чата.
 */
export async function revealTaskContacts(taskId: number): Promise<RevealResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { status: "unauthorized" };

  const parsed = revealSchema.safeParse({ id: taskId });
  if (!parsed.success) return { status: "not-found" };

  const task = await getTaskOwner(parsed.data.id);
  if (!task) return { status: "not-found" };

  const contacts = await getVisibleContacts(task.userId);
  return { status: "ok", contacts };
}
