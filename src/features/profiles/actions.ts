"use server";

import { APIError } from "better-auth/api";
import { and, eq, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import {
  getProfileIdByUserId,
  getProfileOwner,
  getVisibleContacts,
  type VisibleContact,
} from "@/features/profiles/queries";
import {
  toContactRows,
  updateContactsSchema,
  updateProfileSchema,
} from "@/features/profiles/schemas";
import { getServiceOwner } from "@/features/services/queries";
import { getTaskOwner } from "@/features/tasks/queries";
import { ActionError, authedAction, NotFoundError } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileContacts, profiles } from "@/lib/db/schema";

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

/**
 * Контакты с публичной страницы профиля.
 *
 * Третий вход в тот же механизм: у услуг и заданий раскрытие привязано
 * к объявлению, здесь — к самому профилю. Правила те же — сессия обязательна,
 * контакты не попадают в разметку страницы.
 */
export async function revealProfileContacts(profileId: number): Promise<RevealResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { status: "unauthorized" };

  const parsed = revealSchema.safeParse({ id: profileId });
  if (!parsed.success) return { status: "not-found" };

  const profile = await getProfileOwner(parsed.data.id);
  if (!profile) return { status: "not-found" };

  const contacts = await getVisibleContacts(profile.userId);
  return { status: "ok", contacts };
}

/**
 * Сохранение контактных каналов владельцем профиля.
 *
 * Проверки прав на объект отдельной строкой здесь нет намеренно, и это не
 * упущение правила 3.3: единственный объект действия — профиль самого
 * пользователя, а `profileId` берётся из сессии через `getProfileIdByUserId`.
 * В форму он не передаётся, поэтому подменить его прямым POST нечем.
 *
 * Форма — полное состояние контактов, а не патч: каналы, которых в ней нет,
 * удаляются. Всё одним батчем, потому что частично сохранённые контакты — это
 * профиль, показывающий не то, что человек только что подтвердил. Батч у
 * драйвера `neon-http` выполняется одной транзакцией (ARCHITECTURE.md, 9.1);
 * интерактивные транзакции ему по-прежнему недоступны и здесь не нужны.
 */
export const updateContacts = authedAction(updateContactsSchema, async (input, { userId }) => {
  const profile = await getProfileIdByUserId(userId);
  if (!profile) throw new NotFoundError("Профиль не найден");

  const rows = toContactRows(input);
  const keptChannels = rows.map((row) => row.channel);

  // notInArray с пустым списком в SQL не выражается: при полностью пустой
  // форме удаляем все контакты профиля.
  const removeStale = db
    .delete(profileContacts)
    .where(
      keptChannels.length
        ? and(
            eq(profileContacts.profileId, profile.id),
            notInArray(profileContacts.channel, keptChannels),
          )
        : eq(profileContacts.profileId, profile.id),
    );

  const upserts = rows.map((row) =>
    db
      .insert(profileContacts)
      .values({
        profileId: profile.id,
        channel: row.channel,
        value: row.value,
        isVisible: row.isVisible,
      })
      // Цель конфликта — уникальный индекс profile_contacts_profile_channel_uq.
      .onConflictDoUpdate({
        target: [profileContacts.profileId, profileContacts.channel],
        set: { value: row.value, isVisible: row.isVisible },
      }),
  );

  await db.batch([removeStale, ...upserts]);

  revalidatePath("/dashboard/profile");
});

/**
 * Сохранение профиля владельцем: имя, правовая форма, город, опыт, «о себе».
 *
 * Права на объект, как и в `updateContacts`, не проверяются отдельной строкой:
 * `profileId` берётся из сессии, а `updateUser` вообще работает только с
 * текущим пользователем. Подменить чужой профиль прямым POST нечем.
 *
 * **Имя пишется через API better-auth, а не `db.update(user)`.** Эндпоинт
 * обновляет cookie сессии; при прямой записи в таблицу шапка показывала бы
 * старое имя до перелогина. Таблица `user` остаётся территорией плагина.
 *
 * Email в схему не входит: его смена — отдельный сценарий better-auth
 * (`/change-email`) с подтверждением по почте, в конфиге он не включён.
 *
 * Две записи идут в разные системы — auth API и Drizzle, — поэтому одной
 * транзакцией они не покрываются: `db.batch` работает только со своими
 * запросами. Сбой между шагами оставит новое имя при старом городе; повторное
 * сохранение это чинит. Порядок выбран так, что сначала выполняется шаг,
 * у которого больше причин отказать.
 */
export const updateProfile = authedAction(updateProfileSchema, async (input, { userId }) => {
  const profile = await getProfileIdByUserId(userId);
  if (!profile) throw new NotFoundError("Профиль не найден");

  try {
    await auth.api.updateUser({ body: { name: input.name }, headers: await headers() });
  } catch (error) {
    // Текст better-auth наружу не отдаём: он на английском и рассчитан на API.
    if (error instanceof APIError) throw new ActionError("Не удалось сохранить имя");
    throw error;
  }

  await db
    .update(profiles)
    .set({
      type: input.type,
      cityId: input.cityId,
      bio: input.bio,
      experienceYears: input.experienceYears,
    })
    .where(eq(profiles.id, profile.id));

  revalidatePath("/dashboard/profile");
});
