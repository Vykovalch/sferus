"use server";

import { APIError } from "better-auth/api";
import { and, eq, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import {
  getProfileIdByUserId,
  getProfileOwner,
  getRevealUsage,
  getVisibleContacts,
  type RevealTargetKind,
  type VisibleContact,
} from "@/features/profiles/queries";
import {
  isRevealAllowed,
  REVEAL_LIMIT_PER_DAY,
  REVEAL_WINDOW_MS,
  shouldRecordReveal,
} from "@/features/profiles/reveal-policy";
import {
  changePasswordSchema,
  toContactRows,
  updateAvatarSchema,
  updateContactsSchema,
  updateProfileSchema,
} from "@/features/profiles/schemas";
import { getServiceOwner } from "@/features/services/queries";
import { getTaskOwner } from "@/features/tasks/queries";
import { ActionError, authedAction, NotFoundError } from "@/lib/action-client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { contactReveals, profileContacts, profiles } from "@/lib/db/schema";
import { isUploadedImageUrl } from "@/lib/images";
import { deleteImages } from "@/lib/storage";

const revealSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type RevealResult =
  | { status: "ok"; contacts: VisibleContact[] }
  | { status: "unauthorized" }
  | { status: "not-found" }
  | { status: "rate-limited"; limit: number };

/**
 * Общее тело трёх действий раскрытия.
 *
 * Вынесено не ради красоты: проверка квоты и запись в журнал обязаны быть
 * одинаковыми во всех трёх входах, а три копии этой логики разойдутся при
 * первой же правке — и разойдутся молча.
 *
 * Само правило квоты живёт в `reveal-policy.ts` чистыми функциями: из файла
 * с `'use server'` нельзя экспортировать ничего, кроме действий, а правило,
 * которое защищает единственный канал связи в v1, обязано быть покрыто тестами.
 */
async function revealContacts(
  target: { kind: RevealTargetKind; id: number },
  findOwner: (id: number) => Promise<{ userId: string } | null>,
): Promise<RevealResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { status: "unauthorized" };

  const parsed = revealSchema.safeParse({ id: target.id });
  if (!parsed.success) return { status: "not-found" };

  const owner = await findOwner(parsed.data.id);
  if (!owner) return { status: "not-found" };

  const usage = await getRevealUsage(
    session.user.id,
    { kind: target.kind, id: parsed.data.id },
    new Date(Date.now() - REVEAL_WINDOW_MS),
  );

  if (!isRevealAllowed(usage)) {
    return { status: "rate-limited", limit: REVEAL_LIMIT_PER_DAY };
  }

  const contacts = await getVisibleContacts(owner.userId);

  if (shouldRecordReveal(usage, contacts.length)) {
    await db.insert(contactReveals).values({
      userId: session.user.id,
      ownerId: owner.userId,
      targetKind: target.kind,
      targetId: parsed.data.id,
    });
  }

  return { status: "ok", contacts };
}

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
  return revealContacts({ kind: "service", id: serviceId }, getServiceOwner);
}

/**
 * Контакты автора задания — тот же механизм, что и у услуг: раскрытие
 * заменяет отклики в v1 (см. ROADMAP.md, 1.3) — единственный способ связи
 * между пользователями без внутреннего чата.
 */
export async function revealTaskContacts(taskId: number): Promise<RevealResult> {
  return revealContacts({ kind: "task", id: taskId }, getTaskOwner);
}

/**
 * Контакты с публичной страницы профиля.
 *
 * Третий вход в тот же механизм: у услуг и заданий раскрытие привязано
 * к объявлению, здесь — к самому профилю. Правила те же — сессия обязательна,
 * контакты не попадают в разметку страницы.
 */
export async function revealProfileContacts(profileId: number): Promise<RevealResult> {
  return revealContacts({ kind: "profile", id: profileId }, getProfileOwner);
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

/**
 * Смена и удаление аватара.
 *
 * Пишем в `user.image` через API better-auth — по тем же двум причинам, что
 * и имя: эндпоинт обновляет cookie сессии (иначе шапка показывала бы старый
 * аватар до перелогина), а таблица `user` остаётся территорией плагина.
 * Колонки `profiles.avatar` больше нет: источник истины один.
 *
 * Старый файл удаляется после успешной замены и best-effort — осиротевший
 * файл лучше, чем аватар, который не сменился из-за недоступного хранилища.
 */
export const updateAvatar = authedAction(updateAvatarSchema, async (input, ctx) => {
  const previous = ctx.session.user.image ?? null;
  const next = input.imageUrl === "" ? null : input.imageUrl;

  if (previous === next) return;

  try {
    await auth.api.updateUser({ body: { image: next }, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) throw new ActionError("Не удалось сохранить фотографию");
    throw error;
  }

  // Удаляем только то, что лежит у нас: `user.image` может указывать
  // на картинку из Google-аккаунта, и её удалять нечем и незачем.
  if (previous && isUploadedImageUrl(previous)) {
    await deleteImages([previous]);
  }

  revalidatePath("/dashboard/profile");
});

/**
 * Смена пароля из кабинета.
 *
 * Server Action, а не клиентский вызов `authClient`, как в формах входа
 * и сброса пароля: те работают до появления сессии и живут в `(auth)`,
 * а эта форма стоит в кабинете рядом с профилем и контактами — там ожидаются
 * одинаковые подсказки под полями и одинаковое поведение при ошибке.
 * `authedAction` заодно закрывает проверку сессии.
 *
 * Текущий пароль проверяет сам better-auth: своей проверки здесь нет и быть
 * не может — хеш пароля лежит в его таблице `account`, и трогать её напрямую
 * значило бы дублировать логику сверки.
 *
 * Остальные сессии не отзываются: смена пароля в кабинете — это не «меня
 * взломали», а плановое действие, и выкидывать человека с телефона за то,
 * что он поменял пароль на ноутбуке, недружелюбно. Отзыв сессий уместен
 * в сценарии восстановления доступа, а он идёт через сброс по почте.
 */
export const changePassword = authedAction(changePasswordSchema, async (input) => {
  try {
    await auth.api.changePassword({
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      },
      headers: await headers(),
    });
  } catch (error) {
    // Единственная ожидаемая ошибка — неверный текущий пароль. Текст
    // better-auth английский и рассчитан на API, наружу его не отдаём.
    if (error instanceof APIError) throw new ActionError("Неверный текущий пароль");
    throw error;
  }
});
