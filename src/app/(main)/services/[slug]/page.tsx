import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { CategorySidebar } from "@/features/services/components/CategorySidebar";
import { getServiceCardsByCategory } from "@/features/services/queries";
import { parseServiceCatalogFilters } from "@/features/services/schemas";
import { formatServicePrice } from "@/lib/format";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const filters = parseServiceCatalogFilters(await searchParams);

  const [categories, cities] = await Promise.all([getCategories(), getCities()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const services = await getServiceCardsByCategory(slug, filters);
  const hasActiveFilters = Boolean(filters.cityName || filters.executorType);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">{category.name}</h1>
        <div className="flex gap-6">
          {/* Сайдбар */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <CategorySidebar cities={cities} categorySlug={slug} {...filters} />
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
                    <CategorySidebar cities={cities} categorySlug={slug} {...filters} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {services.length === 0 ? (
              <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
                {hasActiveFilters ? (
                  <>
                    <p className="text-sm font-medium text-foreground mb-1">
                      По заданным фильтрам ничего не нашлось
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Попробуйте выбрать другой город или тип исполнителя
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="border-brand text-brand hover:bg-brand/5 cursor-pointer"
                    >
                      <Link href={`/services/${slug}`}>Сбросить фильтры</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground mb-1">
                      В этой категории пока нет объявлений
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Станьте первым — разместите здесь свою услугу
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="border-brand text-brand hover:bg-brand/5 cursor-pointer"
                    >
                      <Link href="/services/new">Разместить объявление</Link>
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
