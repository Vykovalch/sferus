import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { requireAdminSession } from "@/features/admin/guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Роль приходит из плагина admin (better-auth). Заблокированных пользователей
  // плагин не пускает ещё на входе, поэтому отдельная проверка здесь не нужна.
  //
  // Та же проверка стоит в каждой странице раздела: layout не перерендеривается
  // при клиентской навигации, поэтому одного его недостаточно — см. `guard.ts`.
  await requireAdminSession();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background">
        <PageContainer className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Админ-панель
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Вернуться на сайт
          </Link>
        </PageContainer>
      </div>

      <PageContainer className="py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="w-full lg:w-56 flex-shrink-0 lg:sticky lg:top-6">
            <AdminSidebar />
          </aside>
          <div className="flex-1 min-w-0 max-w-3xl">{children}</div>
        </div>
      </PageContainer>
    </div>
  );
}
