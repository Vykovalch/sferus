import { FilterLinkGroup } from "@/components/shared/FilterLinkGroup";
import type { CityOption } from "@/features/cities/queries";
import { EXECUTOR_TYPE_LABELS, type ServiceCatalogFilters } from "@/features/services/schemas";
import { profileType } from "@/lib/db/schema";

interface CategorySidebarProps extends ServiceCatalogFilters {
  /** Города из БД: серверный компонент получает их от страницы. */
  cities: CityOption[];
  categorySlug: string;
}

/** Собирает адрес каталога с обновлённым набором фильтров, остальные сохраняя. */
function buildCatalogHref(
  categorySlug: string,
  filters: ServiceCatalogFilters,
  overrides: ServiceCatalogFilters,
) {
  const next = { ...filters, ...overrides };
  const search = new URLSearchParams();
  if (next.cityName) search.set("city", next.cityName);
  if (next.executorType) search.set("type", next.executorType);

  const query = search.toString();
  return `/services/${categorySlug}${query ? `?${query}` : ""}`;
}

export function CategorySidebar({
  cities,
  categorySlug,
  cityName,
  executorType,
}: CategorySidebarProps) {
  const activeFilters: ServiceCatalogFilters = { cityName, executorType };

  const executorOptions = [
    { label: "Все исполнители", value: undefined },
    ...profileType.enumValues.map((value) => ({ label: EXECUTOR_TYPE_LABELS[value], value })),
  ];

  const cityOptions = [
    { label: "Все города", value: undefined },
    ...cities.map((city) => ({ label: city.name, value: city.name })),
  ];

  return (
    <div className="space-y-3">
      <FilterLinkGroup
        title="Исполнитель"
        options={executorOptions.map((option) => ({
          label: option.label,
          href: buildCatalogHref(categorySlug, activeFilters, { executorType: option.value }),
          active: executorType === option.value,
        }))}
      />
      <FilterLinkGroup
        title="Город"
        options={cityOptions.map((option) => ({
          label: option.label,
          href: buildCatalogHref(categorySlug, activeFilters, { cityName: option.value }),
          active: cityName === option.value,
        }))}
      />
    </div>
  );
}
