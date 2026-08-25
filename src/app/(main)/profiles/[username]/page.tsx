import { Building2, CheckCircle2, MapPin, User } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
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
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer className="py-6 pb-24 lg:pb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {/* Карточка профиля */}
            <div className="bg-background border border-border rounded-xl p-5 md:p-6 shadow-sm">
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
                    <h1 className="text-xl md:text-2xl font-medium text-foreground tracking-tight">
                      {profile.name}
                    </h1>
                    {profile.isVerified && (
                      <CheckCircle2
                        className="h-5 w-5 text-brand flex-shrink-0"
                        aria-label="Проверенный аккаунт"
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
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-medium text-foreground mb-3">
                  Объявления ({services.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-medium text-foreground mb-3">
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
              <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
                <p className="text-sm text-muted-foreground">Пока нет объявлений</p>
              </div>
            )}
          </div>

          {/* Сайдбар — контакты */}
          <div className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0 sticky top-6">
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <p className="text-xs text-muted-foreground mb-3">
                {isCompany ? "Свяжитесь с компанией" : "Свяжитесь с исполнителем"}
              </p>
              <ContactRevealButton
                target={{ kind: "profile", id: profile.profileId }}
                isAuthenticated={Boolean(session)}
                loginCallbackUrl={profilePath}
                className="w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors"
              />
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Мобильная закреплённая панель */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
        </div>
        <ContactRevealButton
          target={{ kind: "profile", id: profile.profileId }}
          isAuthenticated={Boolean(session)}
          loginCallbackUrl={profilePath}
          className="flex-shrink-0 bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors"
        />
      </div>
    </div>
  );
}
