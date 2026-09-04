import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { PageContainer } from "@/components/shared/PageContainer";
import { Pagination } from "@/components/shared/Pagination";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/features/categories/queries";
import { getFavoriteTargetIds } from "@/features/favorites/queries";
import {
  countSearchServices,
  getServiceCountsByCategory,
  searchServiceCards,
} from "@/features/services/queries";
import {
  parseServiceCatalogFilters,
  serviceCatalogSearchParams,
} from "@/features/services/schemas";
import { auth } from "@/lib/auth";
import { categoryIcon, categoryStyle } from "@/lib/constants";
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
    const [results, total, favorites] = await Promise.all([
      searchServiceCards(filters, page),
      countSearchServices(filters),
      getFavoriteTargetIds(session?.user.id),
    ]);

    // Адрес за пределом диапазона — 404, а не пустая сетка: иначе у робота
    // появляется бесконечное пространство пустых страниц.
    if (isPageOutOfRange(page, total)) notFound();

    const totalPages = pageCount(total);
    const pageParams = serviceCatalogSearchParams(filters);

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

          {results.length === 0 ? (
            <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
              <p className="text-sm font-medium text-foreground mb-1">
                По запросу «{filters.query}» ничего не нашлось
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Попробуйте другие слова или выберите категорию
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const style = categoryStyle(cat.slug);
            return (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                icon={categoryIcon(cat.icon)}
                count={counts.get(cat.id) ?? 0}
                iconColor={style.icon}
              />
            );
          })}
        </div>
      </PageContainer>
    </div>
  );
}
