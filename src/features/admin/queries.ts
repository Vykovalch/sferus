import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, cities, services, tasks, user } from "@/lib/db/schema";

/**
 * Запросы админки.
 *
 * Отдельная фича, хотя таблицы те же: у администратора другие права и другой
 * предикат видимости — он видит **всё**, включая выключенное владельцем
 * и заблокированное модератором, тогда как публичные запросы это намеренно
 * отфильтровывают. Смешать их в одну функцию с флагом значит однажды
 * забыть флаг и показать каталогу скрытое.
 */

/**
 * Пагинации в v1 нет — она на этапе 3. Но неограниченный `SELECT` в админке
 * однажды подвесит страницу, поэтому список ограничен: лучше честный «первые
 * сто», чем незаметно растущая выборка.
 */
const LIST_LIMIT = 100;

/** Услуги для модерации — новые сверху, вместе с обоими флагами видимости. */
export async function getServicesForModeration() {
  return db
    .select({
      id: services.id,
      title: services.title,
      createdAt: services.createdAt,
      isActive: services.isActive,
      moderationStatus: services.moderationStatus,
      categorySlug: categories.slug,
      cityName: cities.name,
      authorName: user.name,
    })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .innerJoin(cities, eq(services.cityId, cities.id))
    .innerJoin(user, eq(services.userId, user.id))
    .orderBy(desc(services.createdAt))
    .limit(LIST_LIMIT);
}

/** Задания для модерации. У задания вместо `isActive` — собственный статус. */
export async function getTasksForModeration() {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      createdAt: tasks.createdAt,
      status: tasks.status,
      moderationStatus: tasks.moderationStatus,
      cityName: cities.name,
      authorName: user.name,
    })
    .from(tasks)
    .innerJoin(cities, eq(tasks.cityId, cities.id))
    .innerJoin(user, eq(tasks.userId, user.id))
    .orderBy(desc(tasks.createdAt))
    .limit(LIST_LIMIT);
}

/**
 * Пользователи для админки.
 *
 * Читаем своим запросом, а не через `auth.api.listUsers`: тот отдаёт строку
 * пользователя целиком вместе со служебными полями плагина, а списку нужны
 * шесть колонок (правило 3.4). Мутации — наоборот, только через плагин:
 * бан рвёт сессии, и делать это в обход его логики нельзя.
 */
export async function getUsersForAdmin() {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
    })
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(LIST_LIMIT);
}

export type ModeratedService = Awaited<ReturnType<typeof getServicesForModeration>>[number];
export type ModeratedTask = Awaited<ReturnType<typeof getTasksForModeration>>[number];
export type AdminUser = Awaited<ReturnType<typeof getUsersForAdmin>>[number];
