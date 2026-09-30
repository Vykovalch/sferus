import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/features/profiles/components/ChangePasswordForm";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/settings");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight mb-4 lg:mb-6">Настройки</h1>

      <div className="space-y-6">
        {/* Смена пароля */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Смена пароля</h2>
          <ChangePasswordForm />
        </div>

        {/* Удаление аккаунта.
            Кнопки нет намеренно: удаление необратимо, уносит объявления, задания
            и избранное каскадом, а файлы из хранилища каскад не трогает — их
            нужно убирать отдельно. Делать такую операцию «заодно» нельзя, поэтому
            до отдельной работы удаление идёт через обращение к нам.

            Красный заголовок — единственное место, где цвет заголовка задан
            в разметке: опасную зону так помечают и GitHub, и GitLab, и рамка
            одна этого не говорит. */}
        <div className="bg-card border border-destructive/20 rounded-2xl p-5 sm:p-6">
          <h2 className="text-base font-semibold text-destructive mb-2">Удаление аккаунта</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Чтобы удалить аккаунт,{" "}
            <Link href="mailto:hello@sferus.net" className="text-brand hover:underline">
              свяжитесь с нами
            </Link>
            . Вместе с аккаунтом будут удалены ваши объявления, задания и избранное — отменить это
            будет нельзя.
          </p>
        </div>
      </div>
    </>
  );
}
