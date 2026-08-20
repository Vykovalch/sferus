export * from "./auth-schema";

import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  bigint,
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/* ────────────────────────── enum-типы ────────────────────────── */

export const profileType = pgEnum("profile_type", ["individual", "company"]);

export const contactChannel = pgEnum("contact_channel", ["phone", "whatsapp", "telegram", "viber"]);

export const priceUnit = pgEnum("price_unit", ["hour", "job", "day", "sqm", "unit"]);

// pending и rejected — задел на премодерацию, в v1 не используются.
// Значения включены сразу: ALTER TYPE ... ADD VALUE в старых версиях PostgreSQL
// не выполняется внутри транзакции.
export const moderationStatus = pgEnum("moderation_status", [
  "pending",
  "approved",
  "rejected",
  "blocked",
]);

// in_progress отсутствует намеренно: он подразумевает известного исполнителя,
// а связи задания с исполнителем в v1 нет — см. docs/DATA-MODEL.md.
export const taskStatus = pgEnum("task_status", ["open", "completed", "cancelled"]);

/* ────────────────────────── справочники ────────────────────────── */

export const cities = pgTable("cities", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  order: integer("order").default(0).notNull(),
});

// В v1 категории плоские, parent_id не используется. Колонка сохранена: она уже
// существует в БД, и её удаление было бы миграцией без выгоды.
export const categories = pgTable("categories", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  parentId: bigint("parent_id", { mode: "number" }).references((): AnyPgColumn => categories.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  order: integer("order").default(0).notNull(),
});

/* ────────────────────────── профиль ────────────────────────── */

// type — правовая форма (частное лицо / компания), а не роль.
// Ролей «заказчик» и «исполнитель» в проекте нет: пользователь универсален.
export const profiles = pgTable(
  "profiles",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique(),
    type: profileType("type").default("individual").notNull(),
    bio: text("bio"),
    // Аватара здесь нет намеренно: источник истины — `user.image`.
    // Его заполняет better-auth при входе через Google, меняет тот же
    // `updateUser`, и он приходит внутри сессии — шапка рисует аватар без
    // дополнительного запроса. Вторая колонка под то же значение давала бы
    // вечный вопрос «какое из двух показывать» (DATA-MODEL.md, этап 1.3).
    cityId: bigint("city_id", { mode: "number" }).references(() => cities.id),
    experienceYears: integer("experience_years"),
    isVerified: boolean("is_verified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("profiles_city_idx").on(t.cityId)],
);

// Контактные каналы вынесены из profiles: у каждого канала своя видимость,
// а колоночный вариант потребовал бы восьми колонок и миграции на каждый
// новый мессенджер.
export const profileContacts = pgTable(
  "profile_contacts",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    profileId: bigint("profile_id", { mode: "number" })
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    channel: contactChannel("channel").notNull(),
    value: text("value").notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
  },
  (t) => [uniqueIndex("profile_contacts_profile_channel_uq").on(t.profileId, t.channel)],
);

/* ────────────────────────── услуги ────────────────────────── */

// isActive и moderationStatus независимы намеренно: первый принадлежит автору,
// второй — администратору. Одна колонка позволила бы пользователю снять
// скрытие, наложенное модератором.
export const services = pgTable(
  "services",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price"),
    isNegotiable: boolean("is_negotiable").default(false).notNull(),
    priceUnit: priceUnit("price_unit").default("hour").notNull(),
    categoryId: bigint("category_id", { mode: "number" })
      .notNull()
      .references(() => categories.id),
    cityId: bigint("city_id", { mode: "number" })
      .notNull()
      .references(() => cities.id),
    homeVisit: boolean("home_visit").default(true).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    moderationStatus: moderationStatus("moderation_status").default("approved").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("services_category_idx").on(t.categoryId),
    index("services_city_idx").on(t.cityId),
    index("services_user_idx").on(t.userId),
    index("services_visibility_idx").on(t.isActive, t.moderationStatus),
    index("services_created_at_idx").on(t.createdAt),
    check("services_price_or_negotiable", sql`${t.price} IS NOT NULL OR ${t.isNegotiable}`),
  ],
);

export const serviceImages = pgTable(
  "service_images",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    serviceId: bigint("service_id", { mode: "number" })
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    order: integer("order").default(0).notNull(),
  },
  (t) => [index("service_images_service_idx").on(t.serviceId)],
);

/* ────────────────────────── задания ────────────────────────── */

// status ведёт автор задания, moderationStatus — администратор.
// Отдельный isActive не нужен: состояние автора уже выражено через status.
export const tasks = pgTable(
  "tasks",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    budget: integer("budget"),
    isNegotiable: boolean("is_negotiable").default(false).notNull(),
    categoryId: bigint("category_id", { mode: "number" })
      .notNull()
      .references(() => categories.id),
    cityId: bigint("city_id", { mode: "number" })
      .notNull()
      .references(() => cities.id),
    status: taskStatus("status").default("open").notNull(),
    moderationStatus: moderationStatus("moderation_status").default("approved").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("tasks_category_idx").on(t.categoryId),
    index("tasks_city_idx").on(t.cityId),
    index("tasks_user_idx").on(t.userId),
    index("tasks_status_idx").on(t.status),
    index("tasks_created_at_idx").on(t.createdAt),
    check("tasks_budget_or_negotiable", sql`${t.budget} IS NOT NULL OR ${t.isNegotiable}`),
  ],
);

/* ────────────────────────── избранное ────────────────────────── */

// Услуги и задания в одной таблице: раздел «Избранное» показывает оба типа
// вперемешку с фильтром, при двух таблицах потребовался бы UNION с общей
// пагинацией. CHECK гарантирует, что заполнена ровно одна ссылка.
//
// Отключение и блокировка объявления не удаляют строку, поэтому запись в
// избранном переживает их сама собой — доступность вычисляется в запросе.
// Каскад срабатывает только при физическом удалении объявления.
export const favorites = pgTable(
  "favorites",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    serviceId: bigint("service_id", { mode: "number" }).references(() => services.id, {
      onDelete: "cascade",
    }),
    taskId: bigint("task_id", { mode: "number" }).references(() => tasks.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("favorites_user_service_uq")
      .on(t.userId, t.serviceId)
      .where(sql`${t.serviceId} IS NOT NULL`),
    uniqueIndex("favorites_user_task_uq")
      .on(t.userId, t.taskId)
      .where(sql`${t.taskId} IS NOT NULL`),
    index("favorites_user_created_idx").on(t.userId, t.createdAt),
    check(
      "favorites_exactly_one_target",
      sql`(${t.serviceId} IS NOT NULL AND ${t.taskId} IS NULL) OR (${t.serviceId} IS NULL AND ${t.taskId} IS NOT NULL)`,
    ),
  ],
);
