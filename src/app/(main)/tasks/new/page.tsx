import { ChevronRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { CreateTaskForm } from "@/features/tasks/components/CreateTaskForm";
import { auth } from "@/lib/auth";

export default async function CreateTaskPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/tasks/new");
  }

  const [cities, categories] = await Promise.all([getCities(), getCategories()]);

  return (
    // Изменено: Установлены системные цвета фона и текста
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link
              href="/tasks"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Задания
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span aria-current="page" className="text-foreground font-medium">
              Создать задание
            </span>
          </nav>
        </div>
      </div>

      {/* Контейнер для формы создания задания */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <CreateTaskForm cities={cities} categories={categories} />
      </div>
    </div>
  );
}
