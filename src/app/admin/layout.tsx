import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { ADMIN_EMAILS } from "@/lib/constants";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/admin");

  const isAdmin = (ADMIN_EMAILS as readonly string[]).includes(session.user.email);
  if (!isAdmin) redirect("/");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="w-full lg:w-56 flex-shrink-0 lg:sticky lg:top-6">
            <AdminSidebar />
          </aside>
          <div className="flex-1 min-w-0 max-w-3xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
