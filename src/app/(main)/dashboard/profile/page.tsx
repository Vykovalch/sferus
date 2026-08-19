import { Camera } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCities } from "@/features/cities/queries";
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
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-6">Мой профиль</h1>

      <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-6">
        {/* Аватар */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-xl font-bold text-brand">
              {initials}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand flex items-center justify-center cursor-pointer"
              aria-label="Изменить фото"
            >
              <Camera className="h-3 w-3 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

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
      <div className="bg-background border border-border rounded-xl p-6 shadow-sm mt-6">
        <h2 className="text-sm font-medium text-foreground mb-1">Контакты для клиентов</h2>
        <ContactSettingsForm initialValues={toContactFormValues(contacts)} />
      </div>
    </>
  );
}
