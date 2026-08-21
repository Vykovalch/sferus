import "server-only";

import { and, count, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import type { TaskCatalogFilters } from "@/features/tasks/schemas";
import { db } from "@/lib/db";
import { categories, cities, profiles, tasks, user } from "@/lib/db/schema";
import { offsetFor, PAGE_SIZE } from "@/lib/pagination";

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

/**
 * Условия доски — общие для выборки карточек и для их подсчёта.
 *
 * Как и у услуг, разделены условия, а не цепочка `join`: расхождение в `WHERE`
 * дало бы пагинацию, ведущую на пустые страницы. Соединения ниже повторяются
 * дословно — типы конструктора Drizzle не переживают обёртку с обобщённым
 * набором колонок.
 */
function boardConditions(filters: TaskCatalogFilters) {
  const conditions = [isPubliclyVisible, eq(tasks.status, filters.status)];
  if (filters.categorySlug) conditions.push(eq(categories.slug, filters.categorySlug));
  if (filters.cityName) conditions.push(eq(cities.name, filters.cityName));
  return conditions;
}

/** Карточки заданий для доски, с фильтрами из URL. */
export async function getTaskCards(
  filters: TaskCatalogFilters,
  page = 1,
  pageSize: number = PAGE_SIZE,
) {
  return (
    db
      .select(cardColumns)
      .from(tasks)
      .innerJoin(categories, eq(tasks.categoryId, categories.id))
      .innerJoin(cities, eq(tasks.cityId, cities.id))
      .innerJoin(user, eq(tasks.userId, user.id))
      .leftJoin(profiles, eq(profiles.userId, tasks.userId))
      .where(and(...boardConditions(filters)))
      // `id` вторым ключом обязателен для постраничной выборки: при совпадении
      // дат порядок иначе не определён, и `OFFSET` начнёт терять или повторять
      // задания на стыке страниц.
      .orderBy(desc(tasks.createdAt), desc(tasks.id))
      .limit(pageSize)
      .offset(offsetFor(page, pageSize))
  );
}

/** Сколько всего заданий на доске с учётом фильтров — задаёт число страниц. */
export async function countTaskCards(filters: TaskCatalogFilters) {
  const [row] = await db
    .select({ value: count() })
    .from(tasks)
    .innerJoin(categories, eq(tasks.categoryId, categories.id))
    .innerJoin(cities, eq(tasks.cityId, cities.id))
    .innerJoin(user, eq(tasks.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, tasks.userId))
    .where(and(...boardConditions(filters)));

  return row?.value ?? 0;
}

/**
 * Открытые задания одного заказчика — блок на публичной странице профиля.
 *
 * Только `open`: завершённые и отменённые задания на чужом профиле — архив,
 * который ничего не сообщает посетителю и мешает увидеть актуальное.
 */
export async function getOpenTaskCardsByAuthor(authorId: string) {
  return db
    .select(cardColumns)
    .from(tasks)
    .innerJoin(categories, eq(tasks.categoryId, categories.id))
    .innerJoin(cities, eq(tasks.cityId, cities.id))
    .innerJoin(user, eq(tasks.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, tasks.userId))
    .where(and(isPubliclyVisible, eq(tasks.userId, authorId), eq(tasks.status, "open")))
    .orderBy(desc(tasks.createdAt));
}

/**
 * Полная карточка задания для детальной страницы.
 *
 * Под `cache`: `generateMetadata` и компонент страницы просят одно и то же
 * задание. Кеш действует в пределах одного запроса — это дедупликация,
 * а не хранение между посетителями.
 */
export const getTaskDetail = cache(async (id: number) => {
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
});

/**
 * Адреса заданий для карты сайта — только открытые.
 *
 * Завершённые и отменённые из карты исключены: страница остаётся доступной,
 * но звать на неё робота незачем — предложить по такому заданию уже нечего.
 */
export async function getTaskSitemapEntries() {
  return db
    .select({ id: tasks.id, updatedAt: tasks.updatedAt })
    .from(tasks)
    .where(and(isPubliclyVisible, eq(tasks.status, "open")))
    .orderBy(desc(tasks.updatedAt));
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
