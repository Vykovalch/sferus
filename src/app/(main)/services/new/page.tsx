import { ChevronRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { CreateServiceForm } from "@/features/services/components/CreateServiceForm";
import { auth } from "@/lib/auth";

export default async function CreateServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/services/new");
  }

  const [cities, categories] = await Promise.all([getCities(), getCategories()]);

  return (
    // Изменено: Установлены системные цвета фона и текста (как в CreateTaskPage)
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <PageContainer className="py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link
              href="/services"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Услуги
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span aria-current="page" className="text-foreground font-medium">
              Разместить объявление
            </span>
          </nav>
        </PageContainer>
      </div>

      {/* Контейнер для формы создания услуги */}
      <PageContainer className="py-6 max-w-4xl">
        <CreateServiceForm userName={session.user.name} cities={cities} categories={categories} />
      </PageContainer>
    </div>
  );
}
