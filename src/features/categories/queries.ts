import "server-only";

import { asc } from "drizzle-orm";
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
 * Про отсутствие React `cache()` — см. комментарий в features/cities/queries.ts.
 */
export async function getCategories() {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      icon: categories.icon,
    })
    .from(categories)
    .orderBy(asc(categories.order), asc(categories.name));
}

/** То, что видит UI. Источник истины — возврат запроса, а не ручной интерфейс. */
export type CategoryOption = Awaited<ReturnType<typeof getCategories>>[number];
