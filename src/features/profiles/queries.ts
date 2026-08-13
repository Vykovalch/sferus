import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profileContacts, profiles } from "@/lib/db/schema";

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
