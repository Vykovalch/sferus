import { Edit3, Megaphone, Plus } from "lucide-react";
import { headers } from "next/headers";
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-foreground">Мои услуги</h1>
        <Button
          asChild
          className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer"
        >
          <Link href="/services/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Добавить
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
          <Megaphone className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Нет опубликованных услуг</p>
          <p className="text-xs text-muted-foreground mb-4">
            Создайте первую услугу, чтобы клиенты могли вас найти
          </p>
          <Button
            asChild
            variant="outline"
            className="border-brand text-brand hover:bg-brand/5 cursor-pointer"
          >
            <Link href="/services/new">Создать объявление</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            const isBlocked = service.moderationStatus !== "approved";

            return (
              <div
                key={service.id}
                className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-base font-bold text-brand flex-shrink-0">
                  {service.title.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/services/${service.categorySlug}/${service.id}`}
                    className="text-sm font-medium text-foreground truncate hover:text-brand transition-colors block"
                  >
                    {service.title}
                  </Link>
                  <p className="text-xs text-brand font-medium">
                    {formatServicePrice(service.price, service.isNegotiable, service.priceUnit)}
                  </p>
                </div>

                {/* Состояние модерации отделено от собственного переключателя:
                    заблокированное объявление владелец включить обратно не может */}
                {isBlocked ? (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 bg-destructive/10 text-destructive">
                    Заблокировано
                  </span>
                ) : (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      service.isActive
                        ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {service.isActive ? "Активно" : "Скрыто"}
                  </span>
                )}

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!isBlocked && (
                    <ServiceVisibilityToggle serviceId={service.id} isActive={service.isActive} />
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="h-8 w-8 text-muted-foreground hover:text-brand cursor-pointer"
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
