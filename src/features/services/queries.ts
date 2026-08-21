import "server-only";

import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import type { ServiceCatalogFilters } from "@/features/services/schemas";
import { db } from "@/lib/db";
import { categories, cities, profiles, serviceImages, services, user } from "@/lib/db/schema";
import { offsetFor, PAGE_SIZE } from "@/lib/pagination";

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

/**
 * Первая фотография объявления — превью карточки.
 *
 * Подзапрос, а не join: join размножил бы строки по числу фотографий,
 * и их пришлось бы схлопывать в коде. Индекс `service_images_service_idx`
 * делает выборку дешёвой, а карточке нужен ровно один адрес.
 */
const previewImageUrl = sql<string | null>`(
  select ${serviceImages.url}
  from ${serviceImages}
  where ${serviceImages.serviceId} = ${services.id}
  order by ${serviceImages.order} asc, ${serviceImages.id} asc
  limit 1
)`;

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
  imageUrl: previewImageUrl,
};

/**
 * Полнотекстовый поиск по объявлению.
 *
 * Выражение **дословно повторяет** индекс `services_search_idx` — иначе Postgres
 * его не применит и будет читать таблицу целиком.
 *
 * Заголовок весит больше описания, поэтому совпадение в названии поднимает
 * объявление выше в выдаче.
 */
const searchVector = sql`(setweight(to_tsvector('russian', ${services.title}), 'A') || setweight(to_tsvector('russian', ${services.description}), 'B'))`;

/**
 * Разбор пользовательского запроса.
 *
 * `websearch_to_tsquery`, а не `plainto_tsquery`: он понимает кавычки для точной
 * фразы и минус для исключения, а главное — **никогда не падает** на кривом
 * вводе. Пользователь напишет в поле что угодно, и ошибка синтаксиса tsquery
 * уронила бы страницу.
 */
function searchQuery(text: string) {
  return sql`websearch_to_tsquery('russian', ${text})`;
}

/*
 * Условия ниже — общие для выборки карточек и для их подсчёта.
 *
 * Разделены именно условия, а не цепочка `join`: расхождение в `WHERE` даёт
 * пагинацию, которая обещает страницы и ведёт на пустые. Цепочка соединений
 * повторяется в каждом запросе дословно — обернуть её в общую функцию не
 * выходит, типы конструктора Drizzle после первого `innerJoin` зависят
 * от набора колонок и через обобщённый параметр не выводятся. Дублирование
 * механическое и заметное; молчаливое расхождение фильтров было бы дороже.
 *
 * Подсчёт строк соединения не размножают: `profiles.user_id` уникален,
 * остальные идут по первичным ключам.
 */

/** Условия, общие для каталога и поиска: видимость плюс фильтры из URL. */
function catalogConditions(filters: ServiceCatalogFilters) {
  const conditions = [isPubliclyVisible];
  if (filters.cityName) conditions.push(eq(cities.name, filters.cityName));
  if (filters.executorType) conditions.push(eq(profiles.type, filters.executorType));
  return conditions;
}

/** Условия поиска: к общим добавляется совпадение по полнотекстовому индексу. */
function searchConditions(filters: ServiceCatalogFilters & { query: string }) {
  return [...catalogConditions(filters), sql`${searchVector} @@ ${searchQuery(filters.query)}`];
}

/** Условия каталога категории. `?q=` здесь тоже работает, а не игнорируется молча. */
function categoryConditions(categorySlug: string, filters: ServiceCatalogFilters) {
  const conditions = [...catalogConditions(filters), eq(categories.slug, categorySlug)];
  if (filters.query) conditions.push(sql`${searchVector} @@ ${searchQuery(filters.query)}`);
  return conditions;
}

/**
 * Поиск услуг по всем категориям, страницами.
 *
 * Пустой запрос отдаёт пустой список, а не всю таблицу: сюда приходят только
 * когда в адресе есть `?q=`, и «ничего не спросили» не должно означать
 * «покажи всё».
 */
export async function searchServiceCards(
  filters: ServiceCatalogFilters,
  page = 1,
  pageSize: number = PAGE_SIZE,
) {
  if (!filters.query) return [];

  const query = searchQuery(filters.query);

  return (
    db
      .select(cardColumns)
      .from(services)
      .innerJoin(categories, eq(services.categoryId, categories.id))
      .innerJoin(cities, eq(services.cityId, cities.id))
      .innerJoin(user, eq(services.userId, user.id))
      .leftJoin(profiles, eq(profiles.userId, services.userId))
      .where(and(...searchConditions({ ...filters, query: filters.query })))
      // Сначала релевантность, при равной — свежесть, при равной — id.
      //
      // `id` в конце не украшение, а обязательное условие постраничной выборки:
      // если у двух строк совпадают и ранг, и дата, порядок между ними Postgres
      // не гарантирует, и он может отличаться от запроса к запросу. С `OFFSET`
      // это означает, что строка либо покажется дважды на соседних страницах,
      // либо не покажется вовсе. Уникальная колонка в конце делает порядок
      // полным и воспроизводимым.
      .orderBy(
        desc(sql`ts_rank(${searchVector}, ${query})`),
        desc(services.createdAt),
        desc(services.id),
      )
      .limit(pageSize)
      .offset(offsetFor(page, pageSize))
  );
}

/**
 * Сколько всего объявлений отвечает запросу.
 *
 * Нужен не для красоты: строка «Найдено объявлений: N» после нарезки на страницы
 * иначе показывала бы размер страницы, то есть врала бы. Он же задаёт число
 * страниц. Уходит в `Promise.all` рядом с выборкой — по тем же индексам.
 */
export async function countSearchServices(filters: ServiceCatalogFilters) {
  if (!filters.query) return 0;

  const [row] = await db
    .select({ value: count() })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .innerJoin(cities, eq(services.cityId, cities.id))
    .innerJoin(user, eq(services.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, services.userId))
    .where(and(...searchConditions({ ...filters, query: filters.query })));

  return row?.value ?? 0;
}

/**
 * Адреса объявлений для карты сайта.
 *
 * Только публично видимые: выключенное владельцем или скрытое модератором
 * объявление в карте сайта — это приглашение роботу на страницу, отдающую 404.
 *
 * `updatedAt` уходит в `lastModified`: по нему робот решает, стоит ли
 * перечитывать страницу. Карточка целиком тут не нужна — только адрес и дата.
 */
export async function getServiceSitemapEntries() {
  return db
    .select({
      id: services.id,
      categorySlug: categories.slug,
      updatedAt: services.updatedAt,
    })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .where(isPubliclyVisible)
    .orderBy(desc(services.updatedAt));
}

/** Карточки услуг для каталога категории, с необязательными фильтрами из URL. */
export async function getServiceCardsByCategory(
  categorySlug: string,
  filters: ServiceCatalogFilters = {},
  page = 1,
  pageSize: number = PAGE_SIZE,
) {
  return (
    db
      .select(cardColumns)
      .from(services)
      .innerJoin(categories, eq(services.categoryId, categories.id))
      .innerJoin(cities, eq(services.cityId, cities.id))
      .innerJoin(user, eq(services.userId, user.id))
      .leftJoin(profiles, eq(profiles.userId, services.userId))
      .where(and(...categoryConditions(categorySlug, filters)))
      // `id` вторым ключом — чтобы порядок был полным: см. пояснение в поиске выше.
      .orderBy(desc(services.createdAt), desc(services.id))
      .limit(pageSize)
      .offset(offsetFor(page, pageSize))
  );
}

/** Сколько всего объявлений в категории с учётом фильтров. */
export async function countServicesByCategory(
  categorySlug: string,
  filters: ServiceCatalogFilters = {},
) {
  const [row] = await db
    .select({ value: count() })
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .innerJoin(cities, eq(services.cityId, cities.id))
    .innerJoin(user, eq(services.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, services.userId))
    .where(and(...categoryConditions(categorySlug, filters)));

  return row?.value ?? 0;
}

/**
 * Карточки услуг одного исполнителя — сетка на публичной странице профиля.
 *
 * Отдельно от `getOtherServicesByAuthor`: тот отдаёт узкий список для блока
 * «другие объявления» на детальной странице и исключает текущее объявление.
 * Здесь нужна полная карточка каталога и ничего не исключается.
 */
export async function getServiceCardsByAuthor(authorId: string) {
  return db
    .select(cardColumns)
    .from(services)
    .innerJoin(categories, eq(services.categoryId, categories.id))
    .innerJoin(cities, eq(services.cityId, cities.id))
    .innerJoin(user, eq(services.userId, user.id))
    .leftJoin(profiles, eq(profiles.userId, services.userId))
    .where(and(isPubliclyVisible, eq(services.userId, authorId)))
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
 *
 * Обёрнута в `cache`: `generateMetadata` и сам компонент страницы запрашивают
 * одно и то же объявление, и без этого на каждый показ уходило бы два
 * одинаковых запроса. Кеш живёт в пределах одного запроса — это дедупликация,
 * а не хранение между посетителями.
 */
export const getServiceDetail = cache(async (id: number) => {
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
});

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
 * Фотографии объявления по порядку — галерея на детальной странице
 * и предзаполнение формы правки.
 *
 * Тоже под `cache`: первая фотография нужна и разметке галереи, и превью
 * ссылки в метаданных.
 */
export const getServiceImageUrls = cache(async (serviceId: number) => {
  const rows = await db
    .select({ url: serviceImages.url })
    .from(serviceImages)
    .where(eq(serviceImages.serviceId, serviceId))
    .orderBy(asc(serviceImages.order), asc(serviceImages.id));

  return rows.map((row) => row.url);
});

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
