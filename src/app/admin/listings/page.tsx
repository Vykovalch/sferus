import Link from "next/link";
import { DeleteListingButton } from "@/features/admin/components/DeleteListingButton";
import { ModerationToggle } from "@/features/admin/components/ModerationToggle";
import { getServicesForModeration } from "@/features/admin/queries";

/**
 * Модерация услуг.
 *
 * Проверка роли — в `admin/layout.tsx`, она выполняется до рендера страницы.
 * Действия проверяют роль ещё раз у себя: каждый экспорт из `'use server'` —
 * публичный эндпоинт, и до него можно достучаться в обход интерфейса.
 */
export default async function AdminListingsPage() {
  const services = await getServicesForModeration();

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-1">Объявления</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Модерация объявлений услуг: скрытие из каталога и удаление
      </p>

      {services.length === 0 ? (
        <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
          Нет объявлений
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            const isBlocked = service.moderationStatus === "blocked";

            return (
              <div
                key={service.id}
                className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/services/${service.categorySlug}/${service.id}`}
                    className="text-sm font-medium text-foreground hover:text-brand transition-colors line-clamp-1"
                  >
                    {service.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {service.authorName} · {service.cityName}
                  </p>
                </div>

                {/* Два независимых состояния: скрытие модератора и выключение
                    владельцем. Модератору важно их различать. */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    isBlocked
                      ? "bg-destructive/10 text-destructive"
                      : service.isActive
                        ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isBlocked
                    ? "Скрыто модератором"
                    : service.isActive
                      ? "Опубликовано"
                      : "Выключено владельцем"}
                </span>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <ModerationToggle
                    target={{ kind: "service", id: service.id }}
                    isBlocked={isBlocked}
                  />
                  <DeleteListingButton
                    target={{ kind: "service", id: service.id }}
                    title={service.title}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
