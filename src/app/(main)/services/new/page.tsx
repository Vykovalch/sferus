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
      <PageContainer className="py-6 lg:py-8 max-w-4xl">
        {/* Хлебные крошки — в том же контейнере, что заголовок и содержимое
            (2026-09-29). Раньше они лежали в отдельной обёртке с собственным
            `py-3`, и её нижний отступ складывался с верхним отступом
            содержимого: между крошками и заголовком выходило 36–44px — число,
            которое никто не выбирал. Теперь расстояние задано явно, `mb-3`.

            Обёртка ничего не давала: её `bg-background` совпадал с фоном
            страницы. Возвращать её стоит только ради полосы во всю ширину
            экрана с другим фоном. */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3"
        >
          <Link href="/" className="hover:text-brand transition-colors cursor-pointer font-medium">
            Главная
          </Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground/60" />
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
        <CreateServiceForm userName={session.user.name} cities={cities} categories={categories} />
      </PageContainer>
    </div>
  );
}
