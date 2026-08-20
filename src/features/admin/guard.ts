import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Проверка доступа в админку — вызывается **и в layout, и в каждой странице**.
 *
 * Дублирование намеренное. Документация Next.js предупреждает прямо
 * («Layouts and auth checks»): из-за частичного рендеринга layout не
 * перерендеривается при клиентской навигации, поэтому сессия не проверяется
 * на каждом переходе. Практический сценарий: у администратора отозвали роль,
 * а он остаётся на открытой вкладке — переходя между разделами админки
 * клиентскими переходами, он продолжал бы видеть список пользователей с их
 * адресами.
 *
 * Действия админки защищены отдельно — `requireAdmin` в теле каждого. Layout
 * закрывает вход в раздел, страницы закрывают чтение, действия закрывают
 * запись; ни один из трёх слоёв не заменяет другие.
 */
export async function requireAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/");

  return session;
}
