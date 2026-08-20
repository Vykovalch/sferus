import { headers } from "next/headers";
import Link from "next/link";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { getFavoriteTargetIds } from "@/features/favorites/queries";
import { getServiceCountsByCategory, searchServiceCards } from "@/features/services/queries";
import { parseServiceCatalogFilters } from "@/features/services/schemas";
import { auth } from "@/lib/auth";
import { categoryIcon, categoryStyle } from "@/lib/constants";
import { formatServicePrice } from "@/lib/format";

interface ServicesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Услуги: список категорий либо результаты поиска.
 *
 * Одна страница на два состояния, а не отдельный маршрут `/search`: сюда ведёт
 * форма поиска из шапки и с главной, и разделять «каталог» и «поиск по каталогу»
 * на два адреса незачем.
 */
export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const filters = parseServiceCatalogFilters(await searchParams);

  const [categories, cities] = await Promise.all([getCategories(), getCities()]);

  if (filters.query) {
    const session = await auth.api.getSession({ headers: await headers() });
    const [results, favorites] = await Promise.all([
      searchServiceCards(filters),
      getFavoriteTargetIds(session?.user.id),
    ]);

    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Поиск: «{filters.query}»</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {results.length === 0 ? "Ничего не нашлось" : `Найдено объявлений: ${results.length}`}
          </p>

          <div className="max-w-3xl mb-8">
            <SearchBar cities={cities} />
          </div>

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

              {/* Пагинации пока нет — она делается отдельным срезом сразу
                  для каталога, доски и поиска. Молча обрезать выдачу нельзя. */}
              {results.length === 50 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Показаны первые 50 объявлений. Уточните запрос, чтобы сузить поиск
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  const counts = await getServiceCountsByCategory();

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Услуги</h1>
        <div className="max-w-3xl mb-8">
          <SearchBar cities={cities} />
        </div>
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
      </div>
    </div>
  );
}
