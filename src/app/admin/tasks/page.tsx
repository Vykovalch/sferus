import Link from "next/link";
import { DeleteListingButton } from "@/features/admin/components/DeleteListingButton";
import { ModerationToggle } from "@/features/admin/components/ModerationToggle";
import { requireAdminSession } from "@/features/admin/guard";
import { getTasksForModeration } from "@/features/admin/queries";
import { TASK_STATUSES } from "@/lib/constants";

/** Модерация заданий. Устройство то же, что у услуг. */
export default async function AdminTasksPage() {
  // Layout не перерендеривается при клиентской навигации — проверка нужна здесь.
  await requireAdminSession();

  const tasks = await getTasksForModeration();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Задания</h1>
      <p className="text-sm text-muted-foreground mb-4 lg:mb-6">
        Модерация опубликованных заданий: скрытие с доски и удаление
      </p>

      {tasks.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
          Нет заданий
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isBlocked = task.moderationStatus === "blocked";

            return (
              // Строка по общим правилам списков кабинета — как в модерации
              // объявлений (DESIGN.md, «Строка списка в кабинете»).
              <div
                key={task.id}
                className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-start gap-3 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-sm font-medium text-foreground hover:text-brand transition-colors line-clamp-2"
                  >
                    {task.title}
                  </Link>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      {task.authorName} · {task.cityName}
                    </span>

                    {/* У задания вместо выключателя владельца — жизненный цикл,
                        который ведёт автор: open → completed / cancelled. */}
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        isBlocked
                          ? "bg-destructive/10 text-destructive"
                          : task.status === "open"
                            ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isBlocked ? "Скрыто модератором" : TASK_STATUSES[task.status]}
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-end gap-1 flex-shrink-0">
                  <ModerationToggle target={{ kind: "task", id: task.id }} isBlocked={isBlocked} />
                  <DeleteListingButton target={{ kind: "task", id: task.id }} title={task.title} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
