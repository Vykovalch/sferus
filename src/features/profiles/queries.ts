import "server-only";

import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  cities,
  contactReveals,
  profileContacts,
  profiles,
  type revealTarget,
  user,
} from "@/lib/db/schema";

/**
 * Контакты пользователя, которые он разрешил показывать.
 *
 * Эта функция — единственный путь к контактным данным. Ни один запрос каталога
 * или детальной страницы их не селектит: попади они в возврат такого запроса,
 * оказались бы в HTML и стали бы доступны любому через исходный код страницы,
 * без нажатия кнопки (ARCHITECTURE.md, раздел 8).
 *
 * Вызывать только после проверки сессии — сама функция прав не проверяет.
 */
export async function getVisibleContacts(userId: string) {
  return db
    .select({
      channel: profileContacts.channel,
      value: profileContacts.value,
    })
    .from(profileContacts)
    .innerJoin(profiles, eq(profileContacts.profileId, profiles.id))
    .where(and(eq(profiles.userId, userId), eq(profileContacts.isVisible, true)));
}

export type VisibleContact = Awaited<ReturnType<typeof getVisibleContacts>>[number];

/**
 * Собственные контакты пользователя — для формы настройки.
 *
 * Отдельная функция, а не флаг у `getVisibleContacts`: здесь нужны и скрытые
 * каналы, и колонка `isVisible`. Свести их в одну функцию с параметром значит
 * однажды забыть этот параметр и показать чужие скрытые контакты.
 */
export async function getMyContacts(userId: string) {
  return db
    .select({
      channel: profileContacts.channel,
      value: profileContacts.value,
      isVisible: profileContacts.isVisible,
    })
    .from(profileContacts)
    .innerJoin(profiles, eq(profileContacts.profileId, profiles.id))
    .where(eq(profiles.userId, userId));
}

/**
 * Собственный профиль — для формы настройки.
 *
 * Имени и email здесь нет: они живут в таблице `user` и приходят из сессии,
 * второй запрос за ними не нужен. `username` не селектится — он не
 * редактируется и в форме не участвует.
 */
export async function getMyProfile(userId: string) {
  const [row] = await db
    .select({
      type: profiles.type,
      cityId: profiles.cityId,
      bio: profiles.bio,
      experienceYears: profiles.experienceYears,
    })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  return row ?? null;
}

export type MyProfile = NonNullable<Awaited<ReturnType<typeof getMyProfile>>>;

/**
 * Идентификатор профиля по пользователю сессии.
 *
 * Нужен мутациям профиля и контактов: `profileId` выводится из сессии и никогда
 * не приходит из формы — подменить чужой профиль нечем.
 */
export async function getProfileIdByUserId(userId: string) {
  const [row] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  return row ?? null;
}

/**
 * Публичный профиль по адресу страницы.
 *
 * Контактов здесь нет намеренно: попади они в возврат, оказались бы в HTML
 * страницы и читались бы из исходного кода без нажатия кнопки
 * (ARCHITECTURE.md, раздел 8). Их отдаёт только `revealProfileContacts`.
 *
 * Аватар берётся из `user.image`: он и есть источник истины, `profiles.avatar`
 * удаляется на этапе 2 (DATA-MODEL.md).
 */
export async function getProfileByUsername(username: string) {
  const [row] = await db
    .select({
      profileId: profiles.id,
      userId: profiles.userId,
      name: user.name,
      image: user.image,
      type: profiles.type,
      bio: profiles.bio,
      isVerified: profiles.isVerified,
      experienceYears: profiles.experienceYears,
      createdAt: profiles.createdAt,
      cityName: cities.name,
    })
    .from(profiles)
    .innerJoin(user, eq(profiles.userId, user.id))
    .leftJoin(cities, eq(profiles.cityId, cities.id))
    .where(eq(profiles.username, username))
    .limit(1);

  return row ?? null;
}

export type PublicProfile = NonNullable<Awaited<ReturnType<typeof getProfileByUsername>>>;

/**
 * Сколько раскрытий пользователь потратил за сутки и открывал ли он уже
 * именно этот объект.
 *
 * Один запрос вместо двух: `count(*) filter (...)` — тот же приём, что
 * в `getTaskStatsByAuthor`. Оба числа нужны одновременно, а лишний
 * round-trip к базе на каждое раскрытие того не стоит.
 *
 * Зачем второе число: повторно открыть уже раскрытый контакт — обычное дело
 * (человек вернулся к объявлению), и квоту это тратить не должно. Ограничиваем
 * не частоту нажатий, а число **разных** контактов, до которых пользователь
 * добрался за сутки — именно это и есть сбор базы.
 */
export async function getRevealUsage(
  userId: string,
  target: { kind: RevealTargetKind; id: number },
  since: Date,
) {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      sameTarget: sql<number>`count(*) filter (
        where ${contactReveals.targetKind} = ${target.kind}
          and ${contactReveals.targetId} = ${target.id}
      )::int`,
    })
    .from(contactReveals)
    .where(and(eq(contactReveals.userId, userId), gte(contactReveals.createdAt, since)));

  return row ?? { total: 0, sameTarget: 0 };
}

export type RevealTargetKind = (typeof revealTarget.enumValues)[number];

/**
 * Владелец профиля — минимальная выборка для действия раскрытия контактов.
 * Зеркало `getServiceOwner` и `getTaskOwner`.
 */
export async function getProfileOwner(profileId: number) {
  const [row] = await db
    .select({ id: profiles.id, userId: profiles.userId })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1);

  return row ?? null;
}
