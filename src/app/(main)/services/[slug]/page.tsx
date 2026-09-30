import { ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActiveFilterChips } from "@/components/shared/ActiveFilterChips";
import { PageContainer } from "@/components/shared/PageContainer";
import { Pagination } from "@/components/shared/Pagination";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { getFavoriteTargetIds } from "@/features/favorites/queries";
import { buildCatalogHref, CategorySidebar } from "@/features/services/components/CategorySidebar";
import { countServicesByCategory, getServiceCardsByCategory } from "@/features/services/queries";
import {
  EXECUTOR_TYPE_LABELS,
  parseServiceCatalogFilters,
  serviceCatalogSearchParams,
} from "@/features/services/schemas";
import { auth } from "@/lib/auth";
import { formatServicePrice } from "@/lib/format";
import { buildPageHref, isPageOutOfRange, pageCount, parsePageParam } from "@/lib/pagination";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Метаданные страницы категории.
 *
 * Канонический адрес — категория **без фильтров**: `?city=` и `?type=` дают
 * десятки адресов с почти одинаковым содержимым, и без этого они конкурировали
 * бы друг с другом в выдаче. Номер страницы в каноническом адресе сохраняется —
 * вторая страница это отдельное содержимое, а не дубль первой.
 */
export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = parsePageParam((await searchParams).page);

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  const title = page > 1 ? `${category.name} — страница ${page}` : category.name;
  const canonical = buildPageHref(`/services/${slug}`, new URLSearchParams(), page);

  return {
    title,
    description: `${category.name} в Приднестровье: объявления исполнителей с ценами и контактами. Тирасполь, Бендеры, Рыбница и другие города.`,
    alternates: { canonical },
    openGraph: { title, url: canonical, type: "website" },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const urlParams = await searchParams;
  const filters = parseServiceCatalogFilters(urlParams);
  const page = parsePageParam(urlParams.page);

  const [categories, cities] = await Promise.all([getCategories(), getCities()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const [services, total, favorites] = await Promise.all([
    getServiceCardsByCategory(slug, filters, page),
    countServicesByCategory(slug, filters),
    getFavoriteTargetIds(session?.user.id),
  ]);

  if (isPageOutOfRange(page, total)) notFound();

  const totalPages = pageCount(total);
  const pageParams = serviceCatalogSearchParams(filters);
  const hasActiveFilters = Boolean(filters.cityName || filters.executorType);

  // Плашки над сеткой — тот же принцип «снять один фильтр», что уже есть
  // в самом сайдбаре (buildCatalogHref), просто представленный не списком
  // ссылок, а компактными тегами прямо над результатами.
  const filterChips: { label: string; removeHref: string }[] = [];
  if (filters.executorType) {
    filterChips.push({
      label: EXECUTOR_TYPE_LABELS[filters.executorType],
      removeHref: buildCatalogHref(`/services/${slug}`, filters, { executorType: undefined }),
    });
  }
  if (filters.cityName) {
    filterChips.push({
      label: filters.cityName,
      removeHref: buildCatalogHref(`/services/${slug}`, filters, { cityName: undefined }),
    });
  }

  return (
    // Белый холст, а не серый (решение владельца, 2026-09-29): содержимое
    // страницы — карточки услуг, а у них нет контейнера, форму задаёт сама
    // фотография. Такие карточки кладут на белое — так устроены Ozon, Avito,
    // Airbnb, Etsy, и так же уже сделана секция «Новые объявления» на главной
    // (`bg-card`). Серым остался только каталог категорий на `/services`:
    // там плитки белые и с рамкой, и одна и та же плитка не должна стоять
    // на разных холстах в двух местах сайта. Доска заданий и профиль тоже
    // белые — решение того же дня (DESIGN.md, «Холст страниц со списками»).
    <div className="min-h-screen bg-card text-foreground">
      <PageContainer className="py-6 lg:py-8">
        {/* Хлебные крошки — в том же контейнере, что заголовок и содержимое
            (2026-09-29). Раньше они лежали в отдельной обёртке с собственным
            `py-3`, и её нижний отступ складывался с верхним отступом
            содержимого: между крошками и заголовком выходило 36–44px — число,
            которое никто не выбирал. Теперь расстояние задано явно, `mb-3`.

            Обёртка ничего не давала: её `bg-background` совпадал с фоном
            страницы. Возвращать её стоит только ради полосы во всю ширину
            экрана с другим фоном. */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3"
        >
          <Link href="/" className="hover:text-brand transition-colors font-medium cursor-pointer">
            Главная
          </Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground/60" />
          <Link
            href="/services"
            className="hover:text-brand transition-colors font-medium cursor-pointer"
          >
            Услуги
          </Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span aria-current="page" className="text-foreground font-medium">
            {category.name}
          </span>
        </nav>
        {/* Счётчик под заголовком (2026-09-30) — как на результатах поиска.
            Он говорит, велика ли категория и насколько сузили выдачу
            включённые фильтры: до этого судить об этом можно было только
            по числу карточек на экране.

            Слова другие, чем в поиске: там «Найдено объявлений» — результат
            запроса, здесь «Объявлений» — содержимое категории. При нуле
            строки нет, сообщение остаётся в плашке ниже, и отступ
            под заголовком берёт на себя сам заголовок. */}
        <h1
          className={`text-2xl font-semibold tracking-tight ${total === 0 ? "mb-4 lg:mb-6" : "mb-1"}`}
        >
          {category.name}
        </h1>
        {total > 0 && (
          <p className="text-sm text-muted-foreground mb-4 lg:mb-6">Объявлений: {total}</p>
        )}
        <ActiveFilterChips
          chips={filterChips}
          clearAllHref={buildCatalogHref(`/services/${slug}`, filters, {
            cityName: undefined,
            executorType: undefined,
          })}
        />
        <div className="flex gap-6">
          {/* Сайдбар */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <CategorySidebar cities={cities} basePath={`/services/${slug}`} {...filters} />
          </aside>

          {/* Контентная область */}
          <div className="flex-1 min-w-0">
            {/* Панель фильтров */}
            <div className="flex items-center lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-full px-4 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground text-sm font-medium cursor-pointer"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  {/* Боковые отступы шторки: у SheetContent их нет, а FilterLinkGroup
                        перестал давать свои (2026-09-29). */}
                  <div className="overflow-y-auto px-4 pb-4">
                    <CategorySidebar cities={cities} basePath={`/services/${slug}`} {...filters} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {services.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-10 text-center">
                {/* Только сообщение, без призыва и кнопки создания (решение
                    владельца, 2026-09-29). */}
                <p className="text-base font-medium text-foreground">
                  {hasActiveFilters
                    ? "По выбранным фильтрам ничего не нашлось"
                    : "В этой категории пока нет объявлений"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-5">
                  {services.map((service) => (
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
                  buildHref={(target) => buildPageHref(`/services/${slug}`, pageParams, target)}
                  label="Страницы каталога"
                />
              </>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
