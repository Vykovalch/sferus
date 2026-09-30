import "server-only";

import { asc } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

/**
 * Категории каталога. В v1 плоский список — иерархия не используется,
 * хотя колонка parent_id в схеме есть (см. docs/DATA-MODEL.md).
 *
 * `icon` — имя иконки lucide строкой. Сопоставление имени с компонентом и цветом
 * живёт в lib/constants.ts: цвет относится к дизайн-системе, а не к данным,
 * и хранить Tailwind-классы в БД нельзя — они не попадут в сборку CSS.
 *
 * Обёрнута в React `cache()` (2026-09-30) по той же причине, что `getCities`
 * и `getServiceDetail`: на `/services/[slug]` и `/services` список просят
 * дважды за один запрос — сначала `generateMetadata`, чтобы найти название
 * категории по slug, потом сама страница. Без обёртки это два одинаковых
 * SELECT в одном рендере. Кеш живёт в пределах запроса — дедупликация,
 * а не хранение между посетителями.
 */
export const getCategories = cache(async () => {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      icon: categories.icon,
    })
    .from(categories)
    .orderBy(asc(categories.order), asc(categories.name));
});

/** То, что видит UI. Источник истины — возврат запроса, а не ручной интерфейс. */
export type CategoryOption = Awaited<ReturnType<typeof getCategories>>[number];
