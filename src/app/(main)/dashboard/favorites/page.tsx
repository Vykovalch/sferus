import { ChevronRight, Heart, MapPin } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { getFavorites } from "@/features/favorites/queries";
import { FAVORITE_KINDS, parseFavoritesFilter } from "@/features/favorites/schemas";
import { auth } from "@/lib/auth";
import { formatServicePrice, formatTaskBudget } from "@/lib/format";

interface FavoritesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const FILTER_TABS = [
  { label: "Все", type: undefined },
  { label: "Услуги", type: FAVORITE_KINDS[0] },
  { label: "Задания", type: FAVORITE_KINDS[1] },
] as const;

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/favorites");

  const filter = parseFavoritesFilter(await searchParams);
  const items = await getFavorites(session.user.id, filter);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Избранное</h1>

      {/* Фильтр по типу — ссылками, состояние живёт в адресной строке */}
      <nav aria-label="Тип объявления" className="flex items-center gap-1 mb-6">
        {FILTER_TABS.map((tab) => {
          const isActive = filter.kind === tab.type;
          return (
            <Link
              key={tab.label}
              href={tab.type ? `/dashboard/favorites?type=${tab.type}` : "/dashboard/favorites"}
              aria-current={isActive ? "true" : undefined}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                isActive
                  ? "bg-brand/10 text-brand font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {items.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center">
          <Heart className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          {filter.kind ? (
            <>
              <p className="text-sm font-medium text-foreground mb-1">
                {filter.kind === "service" ? "Нет сохранённых услуг" : "Нет сохранённых заданий"}
              </p>
              <Link
                href="/dashboard/favorites"
                className="text-sm text-brand hover:underline font-medium"
              >
                Показать всё избранное
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground mb-1">Здесь пока пусто</p>
              <p className="text-xs text-muted-foreground mb-4">
                Отмечайте сердечком объявления, к которым захотите вернуться
              </p>
              {/* Шеврон, а не стрелка «→»: `ArrowRight` в интерфейсе
                  не используется, и та же ссылка «смотреть все» на главной
                  набрана шевроном (DESIGN.md, «Стрелки и мелочи»). */}
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-sm text-brand hover:underline font-medium"
              >
                Перейти к услугам
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const href =
              item.kind === "service"
                ? `/services/${item.categorySlug}/${item.id}`
                : `/tasks/${item.id}`;
            const priceLabel =
              item.kind === "service"
                ? formatServicePrice(item.price, item.isNegotiable, item.priceUnit)
                : formatTaskBudget(item.budget, item.isNegotiable);

            return (
              // Строка по общим правилам списков кабинета (DESIGN.md,
              // «Строка списка в кабинете»): название в две строки, прочее
              // строкой ниже с переносом. Подсветка при наведении здесь
              // оставлена — в отличие от «Моих услуг» и «Моих заданий»,
              // вся строка и есть ссылка (`after:absolute`).
              //
              // Цена переехала из правого столбца в строку под названием:
              // столбец был `flex-shrink-0`, и длинная цена вроде
              // «от 15 000 руб. за час» забирала около 150px из 311
              // доступных на 375px.
              <article
                key={`${item.kind}-${item.id}`}
                className="relative bg-card border border-border rounded-2xl p-4 transition-colors hover:border-brand/40"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Тип и категория одной строкой. Тип был набран
                        `text-muted-foreground/70` — это #888 на белом, 3.54:1
                        при норме 4.5 для мелкого текста. */}
                    <p className="text-xs text-muted-foreground mb-1">
                      {item.kind === "service" ? "Услуга" : "Задание"} · {item.categoryName}
                    </p>

                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {/* Недоступное объявление не открывается: детальная страница
                          отдала бы 404. Оставляем как текст с пометкой. */}
                      {item.isAvailable ? (
                        <Link href={href} className="after:absolute after:inset-0 hover:text-brand">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {item.cityName}
                      </span>
                      <span>{priceLabel}</span>
                      {!item.isAvailable && (
                        <span className="px-2 py-0.5 rounded-full bg-muted">
                          Объявление недоступно
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Зона касания 44px приходит из самого компонента
                      (`tap-target`): отметка здесь одна, и накладываться
                      ей не на что. */}
                  <FavoriteButton
                    target={{ kind: item.kind, id: item.id }}
                    isFavorite
                    isAuthenticated
                    className="relative z-10 flex-shrink-0 p-1 rounded-full hover:bg-muted"
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
