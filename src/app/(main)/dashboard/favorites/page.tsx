import { Heart, MapPin } from "lucide-react";
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
      <h1 className="text-xl font-medium text-foreground mb-4">Избранное</h1>

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
        <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
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
              <Link href="/services" className="text-sm text-brand hover:underline font-medium">
                Перейти к услугам →
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
              <article
                key={`${item.kind}-${item.id}`}
                className="relative bg-background border border-border rounded-xl p-4 shadow-sm transition-colors hover:border-brand/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-muted-foreground">{item.categoryName}</span>
                      <span className="text-xs text-muted-foreground/70">
                        {item.kind === "service" ? "Услуга" : "Задание"}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-foreground mb-2">
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

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.cityName}
                      </span>
                      {!item.isAvailable && (
                        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Объявление недоступно
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                    <p className="text-sm font-semibold text-foreground">{priceLabel}</p>
                    <FavoriteButton
                      target={{ kind: item.kind, id: item.id }}
                      isFavorite
                      isAuthenticated
                      className="relative z-10 p-1 rounded-full hover:bg-muted"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
