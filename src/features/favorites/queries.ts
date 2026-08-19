import "server-only";

import { and, eq, isNotNull, sql } from "drizzle-orm";
import type { FavoritesFilter } from "@/features/favorites/schemas";
import { db } from "@/lib/db";
import { categories, cities, favorites, services, tasks } from "@/lib/db/schema";

/**
 * Запросы избранного.
 *
 * Доступность объявления — вычисляемый флаг, а не колонка: отключённое или
 * заблокированное объявление остаётся в избранном с пометкой, но исчезает
 * из каталога. Один предикат, два применения — см. DATA-MODEL.md.
 */

/** Услуга доступна, пока владелец её не выключил и модератор не заблокировал. */
const serviceIsAvailable = sql<boolean>`${services.isActive} and ${services.moderationStatus} = 'approved'`;

/** Задание доступно, пока оно открыто и не заблокировано. */
const taskIsAvailable = sql<boolean>`${tasks.status} = 'open' and ${tasks.moderationStatus} = 'approved'`;

/**
 * Что у пользователя уже в избранном — чтобы карточки в каталоге знали
 * своё состояние.
 *
 * Один дешёвый запрос по индексу вместо join в каждый запрос каталога:
 * иначе публичным выборкам услуг и заданий пришлось бы принимать `userId`
 * ради одной колонки.
 */
export async function getFavoriteTargetIds(userId: string | null | undefined) {
  const serviceIds = new Set<number>();
  const taskIds = new Set<number>();

  // Аноним: пустые множества вместо запроса — вызывающему коду не нужно
  // ветвиться на каждой странице каталога.
  if (!userId) return { serviceIds, taskIds };

  const rows = await db
    .select({ serviceId: favorites.serviceId, taskId: favorites.taskId })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  for (const row of rows) {
    if (row.serviceId !== null) serviceIds.add(row.serviceId);
    if (row.taskId !== null) taskIds.add(row.taskId);
  }

  return { serviceIds, taskIds };
}

export type FavoriteTargetIds = Awaited<ReturnType<typeof getFavoriteTargetIds>>;

function selectFavoriteServices(userId: string) {
  return db
    .select({
      kind: sql<"service">`'service'`,
      favoritedAt: favorites.createdAt,
      id: services.id,
      title: services.title,
      price: services.price,
      isNegotiable: services.isNegotiable,
      priceUnit: services.priceUnit,
      cityName: cities.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
      isAvailable: serviceIsAvailable,
    })
    .from(favorites)
    .innerJoin(services, eq(favorites.serviceId, services.id))
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .innerJoin(cities, eq(services.cityId, cities.id))
    .where(and(eq(favorites.userId, userId), isNotNull(favorites.serviceId)));
}

function selectFavoriteTasks(userId: string) {
  return db
    .select({
      kind: sql<"task">`'task'`,
      favoritedAt: favorites.createdAt,
      id: tasks.id,
      title: tasks.title,
      budget: tasks.budget,
      isNegotiable: tasks.isNegotiable,
      cityName: cities.name,
      categoryName: categories.name,
      isAvailable: taskIsAvailable,
    })
    .from(favorites)
    .innerJoin(tasks, eq(favorites.taskId, tasks.id))
    .innerJoin(categories, eq(tasks.categoryId, categories.id))
    .innerJoin(cities, eq(tasks.cityId, cities.id))
    .where(and(eq(favorites.userId, userId), isNotNull(favorites.taskId)));
}

/**
 * Избранное пользователя: услуги и задания вперемешку, свежие сверху.
 *
 * Две выборки и склейка в памяти, а не `UNION`: у услуги и задания разный
 * набор колонок, а пагинации в v1 нет — она на этапе 3. Когда появится,
 * вопрос вернётся ровно в том виде, как описан в DATA-MODEL.md.
 */
export async function getFavorites(userId: string, filter: FavoritesFilter = {}) {
  const [favoriteServices, favoriteTasks] = await Promise.all([
    filter.kind === "task" ? [] : selectFavoriteServices(userId),
    filter.kind === "service" ? [] : selectFavoriteTasks(userId),
  ]);

  return [...favoriteServices, ...favoriteTasks].sort(
    (a, b) => b.favoritedAt.getTime() - a.favoritedAt.getTime(),
  );
}

export type FavoriteItem = Awaited<ReturnType<typeof getFavorites>>[number];

/** Есть ли отметка — для действия переключения. */
export async function getFavoriteId(userId: string, kind: "service" | "task", targetId: number) {
  const targetColumn = kind === "service" ? favorites.serviceId : favorites.taskId;

  const [row] = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(targetColumn, targetId)))
    .limit(1);

  return row?.id ?? null;
}
