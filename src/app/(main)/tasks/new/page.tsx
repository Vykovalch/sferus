import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function CreateTaskPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/tasks/new");
  }

  return (
    // Изменено: Установлены системные цвета фона и текста
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/tasks"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Задания
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-medium">Создать задание</span>
          </nav>
        </div>
      </div>

      {/* Контейнер для формы создания задания */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <CreateTaskForm />
      </div>
    </div>
  );
}
