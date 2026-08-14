import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import type { TaskCatalogFilters } from "@/features/tasks/schemas";
import { db } from "@/lib/db";
import { categories, cities, profiles, tasks, user } from "@/lib/db/schema";

/**
 * Запросы заданий.
 *
 * Повторяет паттерн `features/services/queries.ts`: каждая функция селектит
 * только нужные колонки (правило 3.4 в ARCHITECTURE.md). У заданий, в отличие
 * от услуг, нет `isActive` — владелец не может скрыть задание, только сменить
 * статус, поэтому видимость в каталоге зависит от одной колонки.
 */

const isPubliclyVisible = eq(tasks.moderationStatus, "approved");

const cardColumns = {
  id: tasks.id,
  title: tasks.title,
  description: tasks.description,
  budget: tasks.budget,
  isNegotiable: tasks.isNegotiable,
  status: tasks.status,
  createdAt: tasks.createdAt,
  cityName: cities.name,
  categoryName: categories.name,
  categorySlug: categories.slug,
  authorName: user.name,
  authorType: profiles.type,
};

/** Карточки заданий для доски, с фильтрами из URL. */
export async function getTaskCards(filters: TaskCatalogFilters) {
  const conditions = [isPubliclyVisible, eq(tasks.status, filters.status)];
  if (filters.categorySlug) conditions.push(eq(categories.slug, filters.categorySlug));
  if (filters.cityName) conditions.push(eq(cities.name, filters.cityName));

  return db
    .select(cardColumns)
    .from(tasks)
    .innerJoin(categories, eq(tasks.categoryId, categories.id))
    .innerJoin(cities, eq(tasks.cityId, cities.id))
    .innerJoin(user, eq(tasks.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, tasks.userId))
    .where(and(...conditions))
    .orderBy(desc(tasks.createdAt));
}

/** Полная карточка задания для детальной страницы. */
export async function getTaskDetail(id: number) {
  const [row] = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      budget: tasks.budget,
      isNegotiable: tasks.isNegotiable,
      status: tasks.status,
      createdAt: tasks.createdAt,
      cityName: cities.name,
      categoryName: categories.name,
      authorId: tasks.userId,
      authorName: user.name,
      authorUsername: profiles.username,
    })
    .from(tasks)
    .innerJoin(categories, eq(tasks.categoryId, categories.id))
    .innerJoin(cities, eq(tasks.cityId, cities.id))
    .innerJoin(user, eq(tasks.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, tasks.userId))
    .where(and(isPubliclyVisible, eq(tasks.id, id)))
    .limit(1);

  return row ?? null;
}

/** Сколько заданий разместил автор и сколько из них завершено — для карточки заказчика. */
export async function getTaskStatsByAuthor(authorId: string) {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      completed: sql<number>`count(*) filter (where ${tasks.status} = 'completed')::int`,
    })
    .from(tasks)
    .where(and(isPubliclyVisible, eq(tasks.userId, authorId)));

  return row ?? { total: 0, completed: 0 };
}

/**
 * Задания владельца для дашборда — включая выключенные модерацией:
 * человек должен видеть собственные задания в любом состоянии.
 */
export async function getMyTasks(userId: string) {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      budget: tasks.budget,
      isNegotiable: tasks.isNegotiable,
      status: tasks.status,
      moderationStatus: tasks.moderationStatus,
    })
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt));
}

/**
 * Задание для формы редактирования. Возвращает и владельца, чтобы вызывающий
 * код мог проверить права — сама функция этого не делает.
 */
export async function getTaskForEdit(id: number) {
  const [row] = await db
    .select({
      id: tasks.id,
      userId: tasks.userId,
      title: tasks.title,
      description: tasks.description,
      budget: tasks.budget,
      isNegotiable: tasks.isNegotiable,
      categoryId: tasks.categoryId,
      cityId: tasks.cityId,
    })
    .from(tasks)
    .where(eq(tasks.id, id))
    .limit(1);

  return row ?? null;
}

/**
 * Владелец задания — минимальная выборка для проверки прав в Server Action.
 * Отдельный запрос вместо полной строки: для проверки владения больше ничего не нужно.
 */
export async function getTaskOwner(id: number) {
  const [row] = await db
    .select({ id: tasks.id, userId: tasks.userId })
    .from(tasks)
    .where(eq(tasks.id, id))
    .limit(1);

  return row ?? null;
}

export type TaskCard = Awaited<ReturnType<typeof getTaskCards>>[number];
export type TaskDetail = NonNullable<Awaited<ReturnType<typeof getTaskDetail>>>;
export type MyTask = Awaited<ReturnType<typeof getMyTasks>>[number];
