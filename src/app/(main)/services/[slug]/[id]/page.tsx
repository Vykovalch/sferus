import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactRevealButton } from "@/components/shared/ContactRevealButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { PageContainer } from "@/components/shared/PageContainer";
import { getFavoriteId } from "@/features/favorites/queries";
import { ServiceGallery } from "@/features/services/components/ServiceGallery";
import {
  getOtherServicesByAuthor,
  getServiceDetail,
  getServiceImageUrls,
} from "@/features/services/queries";
import { auth } from "@/lib/auth";
import { formatAmount, formatMonthYear, formatServicePrice, formatYears } from "@/lib/format";
import { metaDescription } from "@/lib/site";

/** Разбор идентификатора из адреса. Один и тот же для метаданных и страницы. */
function parseServiceId(id: string): number | null {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Метаданные объявления.
 *
 * Это главная страница площадки с точки зрения выдачи: именно её ищут словами
 * «ремонт стиральных машин Тирасполь». Заголовок и описание берутся из самого
 * объявления, а не из общего шаблона сайта.
 *
 * Фотография уходит в превью ссылки. Для Приднестровья это существенно:
 * объявлениями делятся в мессенджерах, и ссылка с картинкой открывается заметно
 * чаще, чем голая строка. Запросы к базе не дублируются — `getServiceDetail`
 * и `getServiceImageUrls` обёрнуты в `cache`, и страница получит те же данные.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}): Promise<Metadata> {
  const { slug, id } = await params;
  const serviceId = parseServiceId(id);
  if (serviceId === null) return {};

  const service = await getServiceDetail(serviceId);
  // Метаданные несуществующей страницы не нужны — ниже она отдаст 404.
  if (!service || service.categorySlug !== slug) return {};

  const images = await getServiceImageUrls(service.id);
  const path = `/services/${service.categorySlug}/${service.id}`;
  const description = metaDescription(service.description);

  return {
    title: service.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: service.title,
      description,
      url: path,
      type: "article",
      images: images.length > 0 ? [{ url: images[0], alt: service.title }] : undefined,
    },
  };
}

export default async function ServiceListingPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const serviceId = parseServiceId(id);
  if (serviceId === null) notFound();

  const service = await getServiceDetail(serviceId);
  if (!service) notFound();

  // Категория входит в адрес: чужой slug не должен открывать объявление
  if (service.categorySlug !== slug) notFound();

  const [session, otherServices, images] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getOtherServicesByAuthor(service.authorId, service.id),
    getServiceImageUrls(service.id),
  ]);

  // Зависит от session.user.id — не может уйти в тот же Promise.all выше.
  const isFavorite = session?.user?.id
    ? (await getFavoriteId(session.user.id, "service", service.id)) !== null
    : false;

  const isCompany = service.authorType === "company";
  const listingPath = `/services/${service.categorySlug}/${service.id}`;
  const priceLabel = formatServicePrice(service.price, service.isNegotiable, service.priceUnit);

  // Кнопка стоит в двух местах: в панели на десктопе и в закреплённой полосе
  // на телефоне. Классы у них разные, поэтому приходят параметром.
  const contactButton = (className: string) => (
    <ContactRevealButton
      target={{ kind: "service", id: service.id }}
      isAuthenticated={Boolean(session)}
      loginCallbackUrl={listingPath}
      className={className}
    />
  );

  const authorInitials = service.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Карточка исполнителя: ссылкой, если у него есть публичный профиль.
  // Раньше при отсутствии `username` в разметке оставался `href="#"` —
  // ссылка в никуда.
  const authorCard = (
    <>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ${
          isCompany ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-brand/10 text-brand"
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
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer className="pt-6 pb-28 lg:pt-8 lg:pb-8">
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
          className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap mb-3"
        >
          <Link href="/" className="hover:text-brand transition-colors cursor-pointer font-medium">
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
        {/* Порядок в разметке и есть порядок на телефоне: сначала объявление,
            потом панель исполнителя (2026-09-30). До этого у них стояли
            `order-1` / `order-2`, и на телефоне первым шёл блок исполнителя —
            аватар, имя и «На платформе с …». Кнопка контактов в нём на телефоне
            скрыта (она в закреплённой полосе внизу), то есть блок без действия
            отодвигал заголовок и фотографии вниз. На широком экране порядок
            тот же: содержимое слева, панель справа. */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
              {/* В строке заголовка остались заголовок и отметка «в избранное».
                  Цена переехала в панель действия: там она стоит рядом
                  с кнопкой, как в закреплённой полосе на телефоне. */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight leading-tight">
                  {service.title}
                </h1>
                <FavoriteButton
                  target={{ kind: "service", id: service.id }}
                  isFavorite={isFavorite}
                  isAuthenticated={!!session}
                  className="flex-shrink-0 p-2 rounded-full border border-border hover:border-brand/50 transition-colors"
                />
              </div>

              {/* Галерея. Компонент был написан ещё до 1.1 и всё это время
                  не использовался — показывать было нечего. */}
              {images.length > 0 && (
                <div className="mb-6">
                  <ServiceGallery images={images} title={service.title} />
                </div>
              )}

              {/* Описание — главный текст страницы, поэтому 16px основным
                  цветом (2026-09-30). До этого стояли 14px `--muted-foreground`,
                  то есть стиль служебной подписи. */}
              <h2 className="text-base font-semibold text-foreground mb-2">Описание услуги</h2>
              <p className="text-base text-foreground leading-relaxed mb-6 whitespace-pre-line">
                {service.description}
              </p>

              {/* Детали услуги. Опыт работы отсюда убран: это свойство
                  исполнителя, и его место в панели рядом с «На платформе с». */}
              <div className="border-t border-border pt-5">
                <h2 className="text-base font-semibold text-foreground mb-3">Детали</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Город</p>
                    <p className="text-sm font-medium text-foreground">{service.cityName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Выезд на дом</p>
                    <p className="text-sm font-medium text-foreground">
                      {service.homeVisit ? "Да" : "Нет"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Другие объявления исполнителя. Строки без собственных рамок:
                рамка внутри рамки давала коробку в коробке. Подсветка
                при наведении — тем же приёмом, что в сайдбаре фильтров. */}
            {otherServices.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h2 className="text-base font-semibold text-foreground mb-2">
                  Другие объявления этого исполнителя
                </h2>
                <div className="flex flex-col">
                  {otherServices.map((other) => (
                    <Link
                      key={other.id}
                      href={`/services/${other.categorySlug}/${other.id}`}
                      className="flex items-center justify-between gap-4 -mx-2 px-2 py-2.5 rounded-lg hover:bg-muted/40 transition-colors group cursor-pointer"
                    >
                      <span className="text-sm text-foreground group-hover:text-brand transition-colors">
                        {other.title}
                      </span>
                      <span className="text-sm text-muted-foreground flex-shrink-0">
                        {other.isNegotiable || other.price === null
                          ? "Договорная"
                          : `от ${formatAmount(other.price)} руб.`}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Цена, действие и исполнитель.
              `lg:top-24` — 96px: высота шапки 72 (`HEADER_HEIGHT_PX`,
              `lg:h-[72px]` в `Header.tsx`) плюс 24 воздуха. При прежних
              `lg:top-6` закреплённая панель прилипала под закреплённой шапкой,
              и её верхние 48px скрывались за ней. */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="text-2xl font-semibold text-foreground leading-tight">
                {priceLabel}
              </div>

              {contactButton(
                "mt-4 hidden lg:flex w-full h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground cursor-pointer font-medium transition-colors",
              )}

              <div className="mt-4 pt-4 border-t border-border">
                {service.authorUsername ? (
                  <Link
                    href={`/profiles/${service.authorUsername}`}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    {authorCard}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">{authorCard}</div>
                )}

                <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
                  {service.authorExperienceYears !== null && (
                    <p>
                      Опыт работы:{" "}
                      <span className="font-medium text-foreground">
                        {formatYears(service.authorExperienceYears)}
                      </span>
                    </p>
                  )}
                  {service.authorCreatedAt && (
                    <p>На платформе с {formatMonthYear(service.authorCreatedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Мобильная закреплённая панель */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-card border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-lg font-semibold text-foreground leading-tight">{priceLabel}</div>
        </div>
        {contactButton(
          "flex-shrink-0 h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground cursor-pointer font-medium transition-colors",
        )}
      </div>
    </div>
  );
}
