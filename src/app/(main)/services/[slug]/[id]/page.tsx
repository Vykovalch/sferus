import { Building2, ChevronRight, MapPin, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactRevealButton } from "@/components/shared/ContactRevealButton";
import { ServiceGallery } from "@/features/services/components/ServiceGallery";
import {
  getOtherServicesByAuthor,
  getServiceDetail,
  getServiceImageUrls,
} from "@/features/services/queries";
import { auth } from "@/lib/auth";
import { formatMonthYear, formatServicePrice, formatYears } from "@/lib/format";

export default async function ServiceListingPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const serviceId = Number(id);
  if (!Number.isInteger(serviceId) || serviceId <= 0) notFound();

  const service = await getServiceDetail(serviceId);
  if (!service) notFound();

  // Категория входит в адрес: чужой slug не должен открывать объявление
  if (service.categorySlug !== slug) notFound();

  const [session, otherServices, images] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getOtherServicesByAuthor(service.authorId, service.id),
    getServiceImageUrls(service.id),
  ]);

  const isCompany = service.authorType === "company";
  const listingPath = `/services/${service.categorySlug}/${service.id}`;
  const priceLabel = formatServicePrice(service.price, service.isNegotiable, service.priceUnit);

  const authorInitials = service.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
          >
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
            <Link
              href={`/services/${service.categorySlug}`}
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              {service.categoryName}
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60"
            />
            <span aria-current="page" className="text-foreground font-medium line-clamp-1">
              {service.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-28 lg:pb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4 order-2 lg:order-1">
            <div className="bg-background border border-border rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-medium text-foreground tracking-tight leading-tight">
                  {service.title}
                </h1>
                <div className="sm:text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-brand">{priceLabel}</div>
                </div>
              </div>

              {/* Бейджи */}
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {service.categoryName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <MapPin className="h-3 w-3" />
                  {service.cityName}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isCompany
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {isCompany ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  {isCompany ? "Компания" : "Частный специалист"}
                </span>
              </div>

              {/* Галерея. Компонент был написан ещё до 1.1 и всё это время
                  не использовался — показывать было нечего. */}
              {images.length > 0 && (
                <div className="mb-6">
                  <ServiceGallery images={images} title={service.title} />
                </div>
              )}

              {/* Описание */}
              <h2 className="text-sm font-medium text-foreground mb-2">Описание услуги</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                {service.description}
              </p>

              {/* Детали */}
              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-medium text-foreground mb-3">Детали</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Стоимость</p>
                    <p className="text-sm font-medium text-foreground">{priceLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Город</p>
                    <p className="text-sm font-medium text-foreground">{service.cityName}</p>
                  </div>
                  {service.authorExperienceYears !== null && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Опыт работы</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatYears(service.authorExperienceYears)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Выезд на дом</p>
                    <p className="text-sm font-medium text-foreground">
                      {service.homeVisit ? "Да" : "Нет"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Другие объявления исполнителя */}
            {otherServices.length > 0 && (
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-medium text-foreground mb-3">
                  Другие объявления этого исполнителя
                </h2>
                <div className="flex flex-col gap-2">
                  {otherServices.map((other) => (
                    <Link
                      key={other.id}
                      href={`/services/${other.categorySlug}/${other.id}`}
                      className="flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:border-brand/50 bg-card/30 hover:bg-card/50 transition-all group cursor-pointer"
                    >
                      <span className="text-sm text-muted-foreground group-hover:text-brand transition-colors">
                        {other.title}
                      </span>
                      <span className="text-sm font-medium text-brand flex-shrink-0 ml-4">
                        {other.isNegotiable || other.price === null
                          ? "Договорная"
                          : `от ${other.price} руб.`}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Исполнитель */}
          <div className="w-full lg:w-60 lg:flex-shrink-0 lg:sticky lg:top-6 order-1 lg:order-2">
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <Link
                href={service.authorUsername ? `/profiles/${service.authorUsername}` : "#"}
                className="flex items-center gap-3 mb-4 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ${
                    isCompany
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "bg-brand/10 text-brand"
                  }`}
                >
                  {authorInitials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-brand transition-colors">
                    {service.authorName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isCompany ? "Компания" : "Частный специалист"}
                  </p>
                </div>
              </Link>

              {service.authorCreatedAt && (
                <p className="text-xs text-muted-foreground border-t border-border pt-3 mb-4">
                  На платформе с {formatMonthYear(service.authorCreatedAt)}
                </p>
              )}

              <ContactRevealButton
                target={{ kind: "service", id: service.id }}
                isAuthenticated={Boolean(session)}
                loginCallbackUrl={listingPath}
                className="hidden lg:flex w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная закреплённая панель */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-brand leading-tight">{priceLabel}</div>
        </div>
        <ContactRevealButton
          target={{ kind: "service", id: service.id }}
          isAuthenticated={Boolean(session)}
          loginCallbackUrl={listingPath}
          className="flex-shrink-0 bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors"
        />
      </div>
    </div>
  );
}
