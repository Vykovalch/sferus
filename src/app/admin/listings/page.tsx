import Link from "next/link";
import { DeleteListingButton } from "@/features/admin/components/DeleteListingButton";
import { ModerationToggle } from "@/features/admin/components/ModerationToggle";
import { requireAdminSession } from "@/features/admin/guard";
import { getServicesForModeration } from "@/features/admin/queries";

/**
 * Модерация услуг.
 *
 * Роль проверяется трижды и это не избыточность: layout закрывает вход в раздел,
 * страница — чтение (layout не перерендеривается при клиентской навигации),
 * действия — запись, потому что каждый экспорт из `'use server'` доступен прямым
 * запросом в обход интерфейса.
 */
export default async function AdminListingsPage() {
  // Layout не перерендеривается при клиентской навигации — проверка нужна здесь.
  await requireAdminSession();

  const services = await getServicesForModeration();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Объявления</h1>
      <p className="text-sm text-muted-foreground mb-4 lg:mb-6">
        Модерация объявлений услуг: скрытие из каталога и удаление
      </p>

      {services.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
          Нет объявлений
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            const isBlocked = service.moderationStatus === "blocked";

            return (
              // Строка по общим правилам списков кабинета (DESIGN.md, «Строка
              // списка в кабинете»): название в две строки, прочее — строкой
              // ниже с переносом, действия до 640px отдельной строкой у правого
              // края. До 2026-10-01 всё стояло в один ряд при любой ширине,
              // и на 375px названию оставалось около 80px: плашка «Скрыто
              // модератором» занимала ~120px, две кнопки — 64.
              <div
                key={service.id}
                className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-start gap-3 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/services/${service.categorySlug}/${service.id}`}
                    className="text-sm font-medium text-foreground hover:text-brand transition-colors line-clamp-2"
                  >
                    {service.title}
                  </Link>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      {service.authorName} · {service.cityName}
                    </span>

                    {/* Два независимых состояния: скрытие модератора
                        и выключение владельцем. Модератору важно их
                        различать. */}
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
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
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-end gap-1 flex-shrink-0">
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
