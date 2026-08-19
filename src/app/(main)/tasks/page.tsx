import { SlidersHorizontal } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { getFavoriteTargetIds } from "@/features/favorites/queries";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { TasksSidebar } from "@/features/tasks/components/TasksSidebar";
import { getTaskCards } from "@/features/tasks/queries";
import { parseTaskCatalogFilters } from "@/features/tasks/schemas";
import { auth } from "@/lib/auth";

interface TasksPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const filters = parseTaskCatalogFilters(await searchParams);

  const session = await auth.api.getSession({ headers: await headers() });
  const [cities, categories, tasks, favorites] = await Promise.all([
    getCities(),
    getCategories(),
    getTaskCards(filters),
    getFavoriteTargetIds(session?.user.id),
  ]);

  const hasActiveFilters = Boolean(filters.categorySlug || filters.cityName);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Задания</h1>
        <div className="flex gap-6">
          {/* Сайдбар */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <TasksSidebar cities={cities} categories={categories} {...filters} />
          </aside>

          {/* Контентная область */}
          <div className="flex-1 min-w-0 max-w-5xl">
            {/* Панель фильтров */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  <div className="overflow-y-auto">
                    <TasksSidebar cities={cities} categories={categories} {...filters} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Список карточек */}
            {tasks.length === 0 ? (
              <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
                {hasActiveFilters ? (
                  <>
                    <p className="text-sm font-medium text-foreground mb-1">
                      По заданным фильтрам ничего не нашлось
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Попробуйте выбрать другую категорию или город
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="border-brand text-brand hover:bg-brand/5 cursor-pointer"
                    >
                      <Link href="/tasks">Сбросить фильтры</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Заданий с таким статусом пока нет
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Станьте первым — разместите задание для исполнителей
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="border-brand text-brand hover:bg-brand/5 cursor-pointer"
                    >
                      <Link href="/tasks/new">Создать задание</Link>
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isFavorite={favorites.taskIds.has(task.id)}
                    isAuthenticated={Boolean(session)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
