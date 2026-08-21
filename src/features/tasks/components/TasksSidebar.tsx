import { FilterLinkGroup } from "@/components/shared/FilterLinkGroup";
import type { CategoryOption } from "@/features/categories/queries";
import type { CityOption } from "@/features/cities/queries";
import { type TaskCatalogFilters, taskCatalogSearchParams } from "@/features/tasks/schemas";
import { TASK_STATUSES } from "@/lib/constants";

interface TasksSidebarProps extends TaskCatalogFilters {
  /** Справочники из БД: серверный компонент получает их от страницы. */
  cities: CityOption[];
  categories: CategoryOption[];
}

/**
 * Собирает адрес доски заданий с обновлённым набором фильтров, остальные сохраняя.
 *
 * Список параметров живёт в `taskCatalogSearchParams` — там же, откуда его
 * берёт пагинация. Номер страницы не передаётся намеренно: смена фильтра
 * возвращает на первую страницу.
 */
function buildBoardHref(filters: TaskCatalogFilters, overrides: Partial<TaskCatalogFilters>) {
  const query = taskCatalogSearchParams({ ...filters, ...overrides }).toString();
  return `/tasks${query ? `?${query}` : ""}`;
}

export function TasksSidebar({
  cities,
  categories,
  categorySlug,
  cityName,
  status,
}: TasksSidebarProps) {
  const activeFilters: TaskCatalogFilters = { categorySlug, cityName, status };

  const categoryOptions = [
    { label: "Все категории", value: undefined },
    ...categories.map((cat) => ({ label: cat.name, value: cat.slug })),
  ];

  const cityOptions = [
    { label: "Все города", value: undefined },
    ...cities.map((city) => ({ label: city.name, value: city.name })),
  ];

  const statusOptions = Object.entries(TASK_STATUSES).map(([value, label]) => ({
    label,
    value: value as TaskCatalogFilters["status"],
  }));

  return (
    <div className="space-y-3">
      <FilterLinkGroup
        title="Категория"
        options={categoryOptions.map((option) => ({
          label: option.label,
          href: buildBoardHref(activeFilters, { categorySlug: option.value }),
          active: categorySlug === option.value,
        }))}
      />
      <FilterLinkGroup
        title="Город"
        options={cityOptions.map((option) => ({
          label: option.label,
          href: buildBoardHref(activeFilters, { cityName: option.value }),
          active: cityName === option.value,
        }))}
      />
      <FilterLinkGroup
        title="Статус"
        options={statusOptions.map((option) => ({
          label: option.label,
          href: buildBoardHref(activeFilters, { status: option.value }),
          active: status === option.value,
        }))}
      />
    </div>
  );
}
