import { Building2, CheckCircle2, ChevronRight, MapPin, User } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactRevealButton } from "@/components/shared/ContactRevealButton";
import { PageContainer } from "@/components/shared/PageContainer";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFavoriteTargetIds } from "@/features/favorites/queries";
import { getProfileByUsername } from "@/features/profiles/queries";
import { getServiceCardsByAuthor } from "@/features/services/queries";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { getOpenTaskCardsByAuthor } from "@/features/tasks/queries";
import { auth } from "@/lib/auth";
import { formatMonthYear, formatServicePrice, formatYears } from "@/lib/format";
import { metaDescription } from "@/lib/site";

/**
 * Метаданные публичного профиля.
 *
 * Описание берётся из «о себе», если человек его заполнил; иначе собирается
 * из того, что известно наверняка. Пустой профиль без подстановки отдал бы
 * в выдачу общее описание сайта — то есть выглядел бы как дубль главной.
 *
 * Аватар уходит в превью ссылки: профилем делятся так же, как объявлением.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) return {};

  const role = profile.type === "company" ? "Компания" : "Частный специалист";
  const place = profile.cityName ? `, ${profile.cityName}` : "";
  const path = `/profiles/${username}`;

  const description = profile.bio
    ? metaDescription(profile.bio)
    : `${role}${place} на Sferus. Услуги, задания и контакты.`;

  return {
    title: profile.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${profile.name} — ${role}`,
      description,
      url: path,
      type: "profile",
      images: profile.image ? [{ url: profile.image, alt: profile.name }] : undefined,
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const [services, tasks, favorites] = await Promise.all([
    getServiceCardsByAuthor(profile.userId),
    getOpenTaskCardsByAuthor(profile.userId),
    getFavoriteTargetIds(session?.user.id),
  ]);

  const isCompany = profile.type === "company";
  const profilePath = `/profiles/${username}`;

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-card text-foreground">
      <PageContainer className="pt-6 pb-24 lg:pt-8 lg:pb-8">
        {/* Хлебные крошки (2026-09-30). До этого профиль был единственной
            страницей-объектом без них: у объявления и задания они есть.
            Звеньев два — вести сюда больше некуда, списка профилей
            на площадке нет. Отступ `mb-3`, как на остальных страницах
            (DESIGN.md, «Хлебные крошки — часть шапки страницы»). */}
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
          <span aria-current="page" className="text-foreground font-medium line-clamp-1">
            {profile.name}
          </span>
        </nav>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {/* Карточка профиля */}
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarImage src={profile.image ?? undefined} alt={profile.name} />
                  <AvatarFallback
                    className={`text-xl font-bold ${
                      isCompany
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-brand/10 text-brand"
                    }`}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                      {profile.name}
                    </h1>
                    {/* У значка `role="img"` обязателен: без роли подпись
                        на `<svg>` объявляется ненадёжно. */}
                    {profile.isVerified && (
                      <CheckCircle2
                        role="img"
                        aria-label="Проверенный аккаунт"
                        className="h-5 w-5 text-brand flex-shrink-0"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
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
                    {profile.cityName && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {profile.cityName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap mb-3 text-sm text-muted-foreground">
                    <span>На платформе с {formatMonthYear(profile.createdAt)}</span>
                    {profile.experienceYears !== null && (
                      <span>Опыт работы: {formatYears(profile.experienceYears)}</span>
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Услуги */}
            {services.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <h2 className="text-base font-semibold text-foreground mb-3">
                  Объявления ({services.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-5">
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
                      imageUrl={service.imageUrl}
                      isFavorite={favorites.serviceIds.has(service.id)}
                      isAuthenticated={Boolean(session)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Задания */}
            {tasks.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <h2 className="text-base font-semibold text-foreground mb-3">
                  Открытые задания ({tasks.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isFavorite={favorites.taskIds.has(task.id)}
                      isAuthenticated={Boolean(session)}
                    />
                  ))}
                </div>
              </div>
            )}

            {services.length === 0 && tasks.length === 0 && (
              <div className="border border-dashed border-border rounded-xl p-10 text-center">
                <p className="text-base font-medium text-foreground">Пока нет объявлений</p>
              </div>
            )}
          </div>

          {/* Сайдбар — контакты.
              `lg:w-80` — как панели на страницах объявления и задания
              (было 240px против 320). `lg:top-24` — 96px: высота шапки 72
              (`HEADER_HEIGHT_PX`) плюс 24 воздуха. При `top-6` закреплённая
              панель прилипала под закреплённой шапкой, и её верх скрывался
              за ней. */}
          <div className="hidden lg:flex flex-col gap-4 lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <p className="text-xs text-muted-foreground mb-3">
                {isCompany ? "Свяжитесь с компанией" : "Свяжитесь с исполнителем"}
              </p>
              <ContactRevealButton
                target={{ kind: "profile", id: profile.profileId }}
                isAuthenticated={Boolean(session)}
                loginCallbackUrl={profilePath}
                className="w-full h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground cursor-pointer font-medium transition-colors"
              />
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Мобильная закреплённая панель */}
      {/* Мобильная закреплённая панель — тот же вид, что на страницах
          объявления и задания: `bg-card` и одна верхняя граница. Своя тень
          `shadow-[0_-4px_16px_rgba(0,0,0,0.08)]` убрана: это была единственная
          такая запись в проекте, и заливка была серой, а не белой. */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-card border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
        </div>
        <ContactRevealButton
          target={{ kind: "profile", id: profile.profileId }}
          isAuthenticated={Boolean(session)}
          loginCallbackUrl={profilePath}
          className="flex-shrink-0 h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground cursor-pointer font-medium transition-colors"
        />
      </div>
    </div>
  );
}
