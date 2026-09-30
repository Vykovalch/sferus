import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCities } from "@/features/cities/queries";
import { AvatarUploader } from "@/features/profiles/components/AvatarUploader";
import { ContactSettingsForm } from "@/features/profiles/components/ContactSettingsForm";
import { ProfileSettingsForm } from "@/features/profiles/components/ProfileSettingsForm";
import { getMyContacts, getMyProfile } from "@/features/profiles/queries";
import { toContactFormValues } from "@/features/profiles/schemas";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/profile");

  const [cities, contacts, profile] = await Promise.all([
    getCities(),
    getMyContacts(session.user.id),
    getMyProfile(session.user.id),
  ]);

  const { user } = session;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight mb-4 lg:mb-6">Мой профиль</h1>

      {/* Панели приведены к рецепту карточки формы (2026-09-30, известная
          проблема 43): до этого стояли `bg-background` на холсте
          `bg-background` — заливка панели совпадала с фоном страницы,
          и держали её только рамка и тень, которой нет больше нигде
          на сайте. Скругление было 12px против общих 16.

          Первая панель без заголовка намеренно: она и есть содержимое
          страницы, её называет `h1`. Заголовок нужен только второй теме. */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
        <AvatarUploader userName={user.name} imageUrl={user.image ?? null} />

        <div className="border-t border-border" />

        <ProfileSettingsForm
          userName={user.name}
          userEmail={user.email}
          cities={cities}
          initialValues={{
            type: profile?.type ?? "individual",
            cityId: profile?.cityId ?? null,
            bio: profile?.bio ?? null,
            experienceYears: profile?.experienceYears ?? null,
          }}
        />
      </div>

      {/* Контакты для клиентов */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 mt-6">
        <h2 className="text-base font-semibold text-foreground mb-1.5">Контакты для клиентов</h2>
        {/* Пояснение стоит под заголовком панели, а не внутри формы: раньше
            оно было первой строкой формы и поднималось к заголовку
            отрицательным отступом. */}
        <p className="text-xs text-muted-foreground mb-5">
          Клиенты увидят отмеченные контакты по кнопке «Показать контакты» на ваших объявлениях
        </p>
        <ContactSettingsForm initialValues={toContactFormValues(contacts)} />
      </div>
    </>
  );
}
