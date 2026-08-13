import "server-only";

import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { cities } from "@/lib/db/schema";

/**
 * Города для выпадающих списков и фильтров.
 *
 * Селектим только нужные колонки — правило 3.4 в ARCHITECTURE.md.
 *
 * Обёртка React `cache()` намеренно не используется: сейчас справочник
 * запрашивается один раз на рендер, и мемоизировать нечего. Добавить её стоит,
 * когда один и тот же список понадобится двум серверным компонентам в одном
 * рендере — признак будет виден как несколько одинаковых SELECT на загрузку.
 * Изменение обратное и не затрагивает вызывающий код.
 */
export async function getCities() {
  return db
    .select({
      id: cities.id,
      name: cities.name,
      slug: cities.slug,
    })
    .from(cities)
    .orderBy(asc(cities.order), asc(cities.name));
}

/** То, что видит UI. Источник истины — возврат запроса, а не ручной интерфейс. */
export type CityOption = Awaited<ReturnType<typeof getCities>>[number];
