import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CreateServiceForm } from "@/features/services/components/CreateServiceForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function CreateServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/services/new");
  }

  return (
    // Изменено: Установлены системные цвета фона и текста (как в CreateTaskPage)
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/services"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Услуги
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span aria-current="page" className="text-foreground font-medium">Разместить объявление</span>
          </nav>
        </div>
      </div>

      {/* Контейнер для формы создания услуги */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <CreateServiceForm userName={session.user.name} />
      </div>
    </div>
  );
}