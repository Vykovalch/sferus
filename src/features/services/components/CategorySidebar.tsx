import { FilterLinkGroup } from "@/components/shared/FilterLinkGroup";
import type { CityOption } from "@/features/cities/queries";
import {
  EXECUTOR_TYPE_LABELS,
  type ServiceCatalogFilters,
  serviceCatalogSearchParams,
} from "@/features/services/schemas";
import { profileType } from "@/lib/db/schema";

interface CategorySidebarProps extends ServiceCatalogFilters {
  /** Города из БД: серверный компонент получает их от страницы. */
  cities: CityOption[];
  /**
   * Страница, на которую ведут ссылки фильтров: `/services/${slug}` для каталога
   * категории, `/services` для результатов поиска. Фильтры у обеих одни и те же,
   * отличается только адрес.
   */
  basePath: string;
}

/**
 * Собирает адрес каталога с обновлённым набором фильтров, остальные сохраняя.
 *
 * Параметры собирает `serviceCatalogSearchParams`, а не эта функция: раньше
 * список параметров был записан здесь и не включал `q`, поэтому клик по городу
 * на странице категории молча терял поисковый запрос.
 *
 * Номер страницы сюда не передаётся намеренно — смена фильтра возвращает
 * на первую страницу. Иначе человек с пятой страницы переключил бы город
 * и попал в пустоту при непустой выдаче.
 */
export function buildCatalogHref(
  basePath: string,
  filters: ServiceCatalogFilters,
  overrides: ServiceCatalogFilters,
) {
  const query = serviceCatalogSearchParams({ ...filters, ...overrides }).toString();
  return `${basePath}${query ? `?${query}` : ""}`;
}

export function CategorySidebar({
  cities,
  basePath,
  cityName,
  executorType,
  query,
}: CategorySidebarProps) {
  // `query` здесь не используется напрямую, но обязан попасть в ссылки:
  // без него клик по городу в результатах поиска или на странице категории
  // с активным поиском терял бы поисковый запрос.
  const activeFilters: ServiceCatalogFilters = { cityName, executorType, query };

  const executorOptions = [
    { label: "Все исполнители", value: undefined },
    ...profileType.enumValues.map((value) => ({ label: EXECUTOR_TYPE_LABELS[value], value })),
  ];

  const cityOptions = [
    { label: "Все города", value: undefined },
    ...cities.map((city) => ({ label: city.name, value: city.name })),
  ];

  return (
    // Без панели (решение владельца, 2026-09-29): ни фона, ни рамки, группы
    // разделяет воздух. Рядом карточки услуг без контейнера, и обрамлённый
    // сайдбар оставался единственным блоком с рамкой на холсте. Рамку ему
    // добавляли днём раньше — ради белого холста, теперь она не нужна вовсе.
    <div className="space-y-6">
      {/* Город выше исполнителя (решение владельца, 2026-09-29). На доске
          заданий первой идёт категория — там это «что ищем», и география
          уточняет предмет. Здесь предмет уже задан: страница категории им
          и является, а в результатах поиска — запросом. Остаётся выбор между
          «где» и «кто это делает», и «где» для местной площадки важнее:
          восемь городов, и мастер из другого города чаще всего не подходит
          вовсе, тогда как частный специалист против компании — уточнение
          по вкусу. */}
      <FilterLinkGroup
        title="Город"
        options={cityOptions.map((option) => ({
          label: option.label,
          href: buildCatalogHref(basePath, activeFilters, { cityName: option.value }),
          active: cityName === option.value,
        }))}
      />
      <FilterLinkGroup
        title="Исполнитель"
        options={executorOptions.map((option) => ({
          label: option.label,
          href: buildCatalogHref(basePath, activeFilters, { executorType: option.value }),
          active: executorType === option.value,
        }))}
      />
    </div>
  );
}
