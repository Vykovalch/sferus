import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import type { ServiceCatalogFilters } from "@/features/services/schemas";
import { db } from "@/lib/db";
import { categories, cities, profiles, services, user } from "@/lib/db/schema";

/**
 * Запросы услуг.
 *
 * Каждая функция селектит только нужные колонки — правило 3.4 в ARCHITECTURE.md.
 * Это не микрооптимизация: здесь решается, какие данные вообще покидают сервер.
 * Контактов владельца тут нет ни в одном запросе — они отдаются отдельно, после
 * проверки сессии (раздел 8 в ARCHITECTURE.md).
 */

/**
 * Объявление видно в каталоге, только если владелец его не выключил
 * и модератор не заблокировал. Два независимых условия — см. DATA-MODEL.md.
 */
const isPubliclyVisible = and(
  eq(services.isActive, true),
  eq(services.moderationStatus, "approved"),
);

/** Поля, общие для карточек каталога. */
const cardColumns = {
  id: services.id,
  title: services.title,
  price: services.price,
  isNegotiable: services.isNegotiable,
  priceUnit: services.priceUnit,
  cityName: cities.name,
  categoryName: categories.name,
  categorySlug: categories.slug,
  authorName: user.name,
  authorType: profiles.type,
};

/** Карточки услуг для каталога категории, с необязательными фильтрами из URL. */
export async function getServiceCardsByCategory(
  categorySlug: string,
  filters: ServiceCatalogFilters = {},
) {
  const conditions = [isPubliclyVisible, eq(categories.slug, categorySlug)];
  if (filters.cityName) conditions.push(eq(cities.name, filters.cityName));
  if (filters.executorType) conditions.push(eq(profiles.type, filters.executorType));

  return db
    .select(cardColumns)
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .innerJoin(cities, eq(services.cityId, cities.id))
    .innerJoin(user, eq(services.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, services.userId))
    .where(and(...conditions))
    .orderBy(desc(services.createdAt));
}

/** Свежие услуги для главной страницы. */
export async function getLatestServiceCards(limit = 6) {
  return db
    .select(cardColumns)
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .innerJoin(cities, eq(services.cityId, cities.id))
    .innerJoin(user, eq(services.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, services.userId))
    .where(isPubliclyVisible)
    .orderBy(desc(services.createdAt))
    .limit(limit);
}

/** Число опубликованных услуг по категориям — для карточек каталога. */
export async function getServiceCountsByCategory() {
  const rows = await db
    .select({
      categoryId: services.categoryId,
      count: sql<number>`count(*)::int`,
    })
    .from(services)
    .where(isPubliclyVisible)
    .groupBy(services.categoryId);

  return new Map(rows.map((r) => [r.categoryId, r.count]));
}

/**
 * Полная карточка услуги для детальной страницы.
 *
 * Контактов владельца здесь нет намеренно: они попали бы в HTML страницы
 * и стали бы доступны любому, кто откроет исходный код, без нажатия кнопки.
 */
export async function getServiceDetail(id: number) {
  const [row] = await db
    .select({
      id: services.id,
      title: services.title,
      description: services.description,
      price: services.price,
      isNegotiable: services.isNegotiable,
      priceUnit: services.priceUnit,
      homeVisit: services.homeVisit,
      createdAt: services.createdAt,
      cityName: cities.name,
      categoryName: categories.name,
      categorySlug: categories.slug,
      authorId: services.userId,
      authorName: user.name,
      authorUsername: profiles.username,
      authorType: profiles.type,
      authorIsVerified: profiles.isVerified,
      authorExperienceYears: profiles.experienceYears,
      authorCreatedAt: profiles.createdAt,
    })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .innerJoin(cities, eq(services.cityId, cities.id))
    .innerJoin(user, eq(services.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, services.userId))
    .where(and(isPubliclyVisible, eq(services.id, id)))
    .limit(1);

  return row ?? null;
}

/** Другие услуги того же исполнителя — блок на детальной странице. */
export async function getOtherServicesByAuthor(authorId: string, exceptId: number) {
  return db
    .select({
      id: services.id,
      title: services.title,
      price: services.price,
      isNegotiable: services.isNegotiable,
      categorySlug: categories.slug,
    })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .where(
      and(isPubliclyVisible, eq(services.userId, authorId), sql`${services.id} <> ${exceptId}`),
    )
    .orderBy(desc(services.createdAt))
    .limit(5);
}

/**
 * Услуги владельца для дашборда — включая выключенные и заблокированные:
 * человек должен видеть собственные объявления в любом состоянии.
 */
export async function getMyServices(userId: string) {
  return db
    .select({
      id: services.id,
      title: services.title,
      price: services.price,
      isNegotiable: services.isNegotiable,
      priceUnit: services.priceUnit,
      isActive: services.isActive,
      moderationStatus: services.moderationStatus,
      categorySlug: categories.slug,
    })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .where(eq(services.userId, userId))
    .orderBy(desc(services.createdAt));
}

/**
 * Услуга для формы редактирования. Возвращает и владельца, чтобы вызывающий код
 * мог проверить права — сама функция этого не делает.
 */
export async function getServiceForEdit(id: number) {
  const [row] = await db
    .select({
      id: services.id,
      userId: services.userId,
      title: services.title,
      description: services.description,
      price: services.price,
      isNegotiable: services.isNegotiable,
      priceUnit: services.priceUnit,
      categoryId: services.categoryId,
      cityId: services.cityId,
      homeVisit: services.homeVisit,
    })
    .from(services)
    .where(eq(services.id, id))
    .limit(1);

  return row ?? null;
}

/**
 * Владелец услуги — минимальная выборка для проверки прав в Server Action.
 * Отдельный запрос вместо полной строки: для проверки владения больше ничего не нужно.
 */
export async function getServiceOwner(id: number) {
  const [row] = await db
    .select({ id: services.id, userId: services.userId })
    .from(services)
    .where(eq(services.id, id))
    .limit(1);

  return row ?? null;
}

export type ServiceCard = Awaited<ReturnType<typeof getServiceCardsByCategory>>[number];
export type ServiceDetail = NonNullable<Awaited<ReturnType<typeof getServiceDetail>>>;
export type MyService = Awaited<ReturnType<typeof getMyServices>>[number];
