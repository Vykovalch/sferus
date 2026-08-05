import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactSettingsForm } from "@/components/dashboard/ContactSettingsForm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/profile");

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

          {/* Форма */}
          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Имя и фамилия</Label>
              <Input id="name" name="name" defaultValue={user.name} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" defaultValue={user.email} type="email" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">Город</Label>
              <select
                id="city"
                name="city"
                className="w-full h-9 px-3 py-1 text-sm bg-background text-foreground border border-input rounded-md focus:outline-none focus:border-brand transition-colors cursor-pointer"
              >
                <option value="">Выберите город</option>
                {["Тирасполь", "Бендеры", "Рыбница", "Дубоссары", "Слободзея"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">О себе</Label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                placeholder="Расскажите о себе, опыте, специализации..."
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-input rounded-md focus:outline-none focus:border-brand placeholder:text-muted-foreground resize-none transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer"
            >
              Сохранить изменения
            </Button>
          </form>
        </div>

        {/* Контакты для клиентов */}
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm mt-6">
          <h2 className="text-sm font-medium text-foreground mb-1">Контакты для клиентов</h2>
          <ContactSettingsForm />
        </div>
    </>
  );
}
