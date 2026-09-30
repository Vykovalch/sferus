import { Camera, Edit3, Megaphone, Plus } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ServiceVisibilityToggle } from "@/features/services/components/ServiceVisibilityToggle";
import { getMyServices } from "@/features/services/queries";
import { auth } from "@/lib/auth";
import { formatServicePrice } from "@/lib/format";

export default async function MyServicesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/services");

  const services = await getMyServices(session.user.id);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Мои услуги</h1>
        <Button
          asChild
          className="h-10 rounded-full px-5 bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground text-base font-medium cursor-pointer transition-colors"
        >
          <Link href="/services/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Создать
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center">
          <Megaphone className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Нет опубликованных услуг</p>
          <p className="text-xs text-muted-foreground mb-4">
            Создайте первую услугу, чтобы клиенты могли вас найти
          </p>
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-full px-5 border-brand text-brand hover:bg-brand/5 text-base font-medium cursor-pointer"
          >
            <Link href="/services/new">Создать объявление</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            const isBlocked = service.moderationStatus !== "approved";

            return (
              // Строка перестроена под узкий экран (2026-09-30). Раньше
              // обложка, название, плашка состояния и две кнопки стояли
              // в один ряд при любой ширине: на 375px названию оставалось
              // около 70px, и от него было видно шесть букв. Теперь состояние
              // ушло под название и переносится вместе с ценой.
              <div
                key={service.id}
                className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-start gap-3 sm:gap-4"
              >
                {/* Настоящая обложка, а не буква названия: своё объявление
                    узнают по снимку. Подзапрос за первой фотографией уже был
                    у карточек каталога, второго запроса не понадобилось. */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/services/${service.categorySlug}/${service.id}`}
                    className="text-sm font-medium text-foreground hover:text-brand transition-colors line-clamp-2"
                  >
                    {service.title}
                  </Link>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs text-muted-foreground">
                      {formatServicePrice(service.price, service.isNegotiable, service.priceUnit)}
                    </span>

                    {/* Состояние модерации отделено от собственного
                        переключателя: заблокированное объявление владелец
                        включить обратно не может */}
                    {isBlocked ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-destructive/10 text-destructive">
                        Заблокировано
                      </span>
                    ) : (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          service.isActive
                            ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {service.isActive ? "Активно" : "Скрыто"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Кнопки 40px — высота управляющих элементов на сайте.
                    Приём `tap-target` здесь не годится: он рисует зону
                    44px вокруг картинки 32px, и у двух соседних кнопок
                    эти зоны накладывались бы друг на друга.

                    До 640px действия встают отдельной строкой у правого края:
                    рядом с названием они забирали 84px из 311 доступных,
                    и на название оставалось 147. Своей строкой они отдают
                    название всю ширину за вычетом обложки — 243px. */}
                <div className="w-full sm:w-auto flex items-center justify-end gap-1 flex-shrink-0">
                  {!isBlocked && (
                    <ServiceVisibilityToggle serviceId={service.id} isActive={service.isActive} />
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="h-10 w-10 text-muted-foreground hover:text-brand cursor-pointer"
                  >
                    <Link
                      href={`/dashboard/services/${service.id}/edit`}
                      aria-label="Редактировать объявление"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
