import {
  parseServiceCatalogFilters,
  type ServiceCatalogFilters,
} from "@/features/services/schemas";

/**
 * Черновик поиска — чистые функции без React.
 *
 * Состояние держит `SearchProvider` (`search-context.tsx`); здесь только правила:
 * откуда берутся значения и когда правка перестаёт действовать. Вынесены
 * отдельным модулем, чтобы их можно было покрыть тестами без рендера.
 */

export interface SearchDraft {
  query: string;
  /** Название города; `undefined` — «Все города». */
  city: string | undefined;
}

export interface StoredDraft {
  /** Адрес, на котором сделана правка, — `pathname?search`. */
  urlKey: string;
  draft: SearchDraft;
}

/**
 * `URLSearchParams` → объект той же формы, что `searchParams` страницы.
 *
 * Повторяющийся ключ даёт массив, одиночный — строку: так Next.js передаёт
 * параметры в `page.tsx`, и `parseServiceCatalogFilters` рассчитан именно на это
 * (при повторе берёт первое значение). `Object.fromEntries` не подходит — он
 * молча оставил бы последнее значение, и шапка разошлась бы с выдачей.
 */
export function searchParamsToRecord(params: URLSearchParams) {
  const record: Record<string, string | string[]> = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    record[key] = values.length === 1 ? values[0] : values;
  }
  return record;
}

/**
 * Фильтры каталога из текущего адреса — только на `/services`.
 *
 * Разбирает та же `parseServiceCatalogFilters`, что и страница: второго
 * разборщика, который мог бы разойтись с выдачей, нет. На остальных страницах
 * фильтров нет: там их нет в адресе, а у заданий они вообще другие.
 */
export function catalogFiltersFromUrl(
  pathname: string,
  params: URLSearchParams,
): ServiceCatalogFilters {
  return pathname === "/services" ? parseServiceCatalogFilters(searchParamsToRecord(params)) : {};
}

/**
 * Какой черновик показывать: правку, если она сделана на этом же адресе,
 * иначе — значения из адреса.
 *
 * Отправленный поиск живёт в адресе; черновик — только неотправленный ввод.
 * Поэтому пока правки нет, черновик равен значениям из URL, а правка с другого
 * адреса после перехода не действует.
 */
export function resolveSearchDraft(
  storedDraft: StoredDraft | null,
  urlKey: string,
  filters: ServiceCatalogFilters,
): SearchDraft {
  if (storedDraft && storedDraft.urlKey === urlKey) return storedDraft.draft;
  return { query: filters.query ?? "", city: filters.cityName };
}
