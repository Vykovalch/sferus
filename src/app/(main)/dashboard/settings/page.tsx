import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/features/profiles/components/ChangePasswordForm";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/settings");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium text-foreground">Настройки</h1>

      {/* Смена пароля */}
      <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-medium text-foreground mb-4">Смена пароля</h2>
        <ChangePasswordForm />
      </div>

      {/* Удаление аккаунта.
          Кнопки нет намеренно: удаление необратимо, уносит объявления, задания
          и избранное каскадом, а файлы из хранилища каскад не трогает — их
          нужно убирать отдельно. Делать такую операцию «заодно» нельзя, поэтому
          до отдельной работы удаление идёт через обращение к нам. */}
      <div className="bg-background border border-destructive/20 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-medium text-destructive mb-2">Удаление аккаунта</h2>
        <p className="text-xs text-muted-foreground">
          Чтобы удалить аккаунт,{" "}
          <Link href="mailto:hello@sferus.md" className="text-brand hover:underline">
            свяжитесь с нами
          </Link>
          . Вместе с аккаунтом будут удалены ваши объявления, задания и избранное — отменить это
          будет нельзя.
        </p>
      </div>
    </div>
  );
}
