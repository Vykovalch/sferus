import { ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActiveFilterChips } from "@/components/shared/ActiveFilterChips";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { PageContainer } from "@/components/shared/PageContainer";
import { Pagination } from "@/components/shared/Pagination";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { getFavoriteTargetIds } from "@/features/favorites/queries";
import { buildCatalogHref, CategorySidebar } from "@/features/services/components/CategorySidebar";
import {
  countSearchServices,
  getServiceCountsByCategory,
  searchServiceCards,
} from "@/features/services/queries";
import {
  EXECUTOR_TYPE_LABELS,
  parseServiceCatalogFilters,
  serviceCatalogSearchParams,
} from "@/features/services/schemas";
import { auth } from "@/lib/auth";
import { formatServicePrice } from "@/lib/format";
import { buildPageHref, isPageOutOfRange, pageCount, parsePageParam } from "@/lib/pagination";

interface ServicesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Метаданные каталога и результатов поиска.
 *
 * **Результаты поиска закрыты от индексации.** Адресов вида `?q=…` бесконечно
 * много, содержимое у них то же, что в каталоге, и поисковики прямо не советуют
 * пускать в индекс внутренний поиск по сайту: в выдаче он выглядит как мусор
 * и тянет вниз оценку всего домена. `follow` при этом остаётся — по ссылкам
 * с такой страницы робот пройти может, просто саму её не покажет.
 */
export async function generateMetadata({ searchParams }: ServicesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const filters = parseServiceCatalogFilters(params);

  if (filters.query) {
    return {
      title: `Поиск: ${filters.query}`,
      robots: { index: false, follow: true },
    };
  }

  const page = parsePageParam(params.page);
  const title = page > 1 ? `Услуги — страница ${page}` : "Все категории услуг";

  return {
    title,
    description:
      "Каталог услуг в Приднестровье: ремонт, уборка, репетиторы, автосервис и другие категории. Исполнители с ценами и контактами.",
    alternates: { canonical: buildPageHref("/services", new URLSearchParams(), page) },
  };
}

/**
 * Услуги: список категорий либо результаты поиска.
 *
 * Одна страница на два состояния, а не отдельный маршрут `/search`: сюда ведёт
 * форма поиска из шапки и с главной, и разделять «каталог» и «поиск по каталогу»
 * на два адреса незачем.
 */
export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const filters = parseServiceCatalogFilters(params);
  const page = parsePageParam(params.page);

  const categories = await getCategories();

  if (filters.query) {
    const session = await auth.api.getSession({ headers: await headers() });
    // Выборка и подсчёт идут вместе: подсчёт задаёт число страниц, и без него
    // строка «Найдено объявлений» показывала бы размер страницы вместо итога.
    const [results, total, favorites, cities] = await Promise.all([
      searchServiceCards(filters, page),
      countSearchServices(filters),
      getFavoriteTargetIds(session?.user.id),
      getCities(),
    ]);

    // Адрес за пределом диапазона — 404, а не пустая сетка: иначе у робота
    // появляется бесконечное пространство пустых страниц.
    if (isPageOutOfRange(page, total)) notFound();

    const totalPages = pageCount(total);
    const pageParams = serviceCatalogSearchParams(filters);
    const hasActiveFilters = Boolean(filters.cityName || filters.executorType);

    // Фильтры поиска устроены так же, как на странице категории: сайдбар,
    // шторка на мобильном и плашки над сеткой. Без них город, пришедший
    // из поиска на главной, сужал бы выдачу невидимо — снять его было нечем.
    // Запрос `q` плашкой не показывается: он в заголовке и в поле шапки,
    // а все ссылки ниже его сохраняют.
    const filterChips: { label: string; removeHref: string }[] = [];
    if (filters.executorType) {
      filterChips.push({
        label: EXECUTOR_TYPE_LABELS[filters.executorType],
        removeHref: buildCatalogHref("/services", filters, { executorType: undefined }),
      });
    }
    if (filters.cityName) {
      filterChips.push({
        label: filters.cityName,
        removeHref: buildCatalogHref("/services", filters, { cityName: undefined }),
      });
    }

    return (
      <div className="bg-background min-h-screen">
        {/* Хлебные крошки */}
        <div className="bg-background">
          <PageContainer className="py-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
            >
              <Link
                href="/"
                className="hover:text-brand transition-colors cursor-pointer font-medium"
              >
                Главная
              </Link>
              <ChevronRight
                aria-hidden="true"
                className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60"
              />
              <Link
                href="/services"
                className="hover:text-brand transition-colors cursor-pointer font-medium"
              >
                Услуги
              </Link>
              <ChevronRight
                aria-hidden="true"
                className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60"
              />
              <span aria-current="page" className="text-foreground font-medium line-clamp-1">
                Поиск: «{filters.query}»
              </span>
            </nav>
          </PageContainer>
        </div>

        <PageContainer className="py-6">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Поиск: «{filters.query}»</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {total === 0 ? "Ничего не нашлось" : `Найдено объявлений: ${total}`}
          </p>
          <ActiveFilterChips
            chips={filterChips}
            clearAllHref={buildCatalogHref("/services", filters, {
              cityName: undefined,
              executorType: undefined,
            })}
          />
          <div className="flex gap-6">
            {/* Сайдбар */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <CategorySidebar cities={cities} basePath="/services" {...filters} />
            </aside>

            {/* Контентная область */}
            <div className="flex-1 min-w-0">
              {/* Панель фильтров */}
              <div className="flex items-center justify-between lg:hidden mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Фильтры
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
                    <SheetHeader className="mb-4">
                      <SheetTitle>Фильтры</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto">
                      <CategorySidebar cities={cities} basePath="/services" {...filters} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {results.length === 0 ? (
                <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    По запросу «{filters.query}» ничего не нашлось
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {hasActiveFilters
                      ? "Попробуйте снять фильтры, изменить запрос или выбрать категорию"
                      : "Попробуйте другие слова или выберите категорию"}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-brand text-brand hover:bg-brand/5 cursor-pointer"
                  >
                    <Link href="/services">Все категории</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-6">
                    {results.map((service) => (
                      <ServiceCard
                        key={service.id}
                        id={service.id}
                        title={service.title}
                        categorySlug={service.categorySlug}
                        city={service.cityName}
                        price={formatServicePrice(
                          service.price,
                          service.isNegotiable,
                          service.priceUnit,
                        )}
                        authorName={service.authorName}
                        authorType={service.authorType}
                        imageUrl={service.imageUrl}
                        isFavorite={favorites.serviceIds.has(service.id)}
                        isAuthenticated={Boolean(session)}
                      />
                    ))}
                  </div>

                  <Pagination
                    page={page}
                    pageCount={totalPages}
                    buildHref={(target) => buildPageHref("/services", pageParams, target)}
                    label="Страницы результатов поиска"
                  />
                </>
              )}
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  const counts = await getServiceCountsByCategory();

  return (
    <div className="bg-background min-h-screen">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <PageContainer className="py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link
              href="/"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Главная
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span aria-current="page" className="text-foreground font-medium">
              Услуги
            </span>
          </nav>
        </PageContainer>
      </div>

      <PageContainer className="py-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Услуги</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 md:gap-x-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              count={counts.get(cat.id) ?? 0}
            />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
