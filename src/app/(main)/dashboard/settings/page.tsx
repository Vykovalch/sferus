import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/settings");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium text-foreground">Настройки</h1>

        {/* Смена пароля */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-foreground mb-4">Смена пароля</h2>
          <form className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="current_password">Текущий пароль</Label>
              <Input id="current_password" name="current_password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new_password">Новый пароль</Label>
              <Input id="new_password" name="new_password" type="password" placeholder="Минимум 8 символов" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Подтвердите пароль</Label>
              <Input id="confirm_password" name="confirm_password" type="password" placeholder="Повторите пароль" />
            </div>
            <Button type="submit" className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer">
              Изменить пароль
            </Button>
          </form>
        </div>

        {/* Уведомления */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-foreground mb-4">Уведомления</h2>
          <div className="space-y-3">
            {[
              { id: "notify_responses", label: "Новые отклики на мои задания" },
              { id: "notify_messages", label: "Сообщения от пользователей" },
              { id: "notify_news", label: "Новости и обновления платформы" },
            ].map((item) => (
              <label key={item.id} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-foreground group-hover:text-brand transition-colors">{item.label}</span>
                <input
                  type="checkbox"
                  id={item.id}
                  defaultChecked={item.id !== "notify_news"}
                  className="h-4 w-4 rounded border-input text-brand accent-brand cursor-pointer"
                />
              </label>
            ))}
          </div>
          <Button type="button" className="mt-4 bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer">
            Сохранить
          </Button>
        </div>

        {/* Опасная зона */}
        <div className="bg-background border border-destructive/20 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-destructive mb-2">Удаление аккаунта</h2>
          <p className="text-xs text-muted-foreground mb-4">
            После удаления все ваши данные, объявления и задания будут безвозвратно удалены.
          </p>
          <Button type="button" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/5 cursor-pointer">
            Удалить аккаунт
          </Button>
        </div>
    </div>
  );
}
