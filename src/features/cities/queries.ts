import "server-only";

import { asc } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/db";
import { cities } from "@/lib/db/schema";

/**
 * Города для выпадающих списков и фильтров.
 *
 * Селектим только нужные колонки — правило 3.4 в ARCHITECTURE.md.
 *
 * Обёрнута в React `cache()`: с 2026-09 список нужен шапке в `(main)/layout.tsx`
 * на каждой странице, и та же страница часто запрашивает его сама (Hero на
 * главной, фильтры каталога, формы объявлений). Без обёртки это были бы
 * одинаковые SELECT в одном рендере. Кеш живёт в пределах одного запроса —
 * дедупликация, а не хранение между посетителями.
 */
export const getCities = cache(async () => {
  return db
    .select({
      id: cities.id,
      name: cities.name,
      slug: cities.slug,
    })
    .from(cities)
    .orderBy(asc(cities.order), asc(cities.name));
});

/** То, что видит UI. Источник истины — возврат запроса, а не ручной интерфейс. */
export type CityOption = Awaited<ReturnType<typeof getCities>>[number];
