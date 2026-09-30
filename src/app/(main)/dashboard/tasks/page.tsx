import { Edit3, FileText, Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaskStatusActions } from "@/features/tasks/components/TaskStatusActions";
import { getMyTasks } from "@/features/tasks/queries";
import { auth } from "@/lib/auth";
import { TASK_STATUSES, type TaskStatus } from "@/lib/constants";
import { formatTaskBudget } from "@/lib/format";

const statusColors: Record<TaskStatus, string> = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export default async function MyTasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/tasks");

  const tasks = await getMyTasks(session.user.id);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Мои задания</h1>
        <Button
          asChild
          className="h-10 rounded-full px-5 bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground text-base font-medium cursor-pointer transition-colors"
        >
          <Link href="/tasks/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Создать
          </Link>
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Нет созданных заданий</p>
          <p className="text-xs text-muted-foreground mb-4">
            Создайте задание — исполнители сами свяжутся с вами
          </p>
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-full px-5 border-brand text-brand hover:bg-brand/5 text-base font-medium cursor-pointer"
          >
            <Link href="/tasks/new">Создать задание</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isBlocked = task.moderationStatus !== "approved";

            return (
              // Строка устроена как в «Моих услугах» (DESIGN.md, «Строка
              // списка в кабинете»), только без обложки: у задания
              // фотографий нет. Название в две строки, бюджет и состояние
              // под ним с переносом, действия у правого края.
              //
              // Подсветка строки при наведении убрана: нажимается не строка,
              // а название внутри неё, и тень с золотой рамкой обещали
              // нажатие, которого нет.
              <div
                key={task.id}
                className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-start gap-3 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-sm font-medium text-foreground leading-snug hover:text-brand transition-colors line-clamp-2"
                  >
                    {task.title}
                  </Link>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTaskBudget(task.budget, task.isNegotiable)}
                    </span>

                    {isBlocked ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-destructive/10 text-destructive">
                        Заблокировано
                      </span>
                    ) : (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}
                      >
                        {TASK_STATUSES[task.status]}
                      </span>
                    )}
                  </div>
                </div>

                {/* До 640px действия встают отдельной строкой у правого края:
                    рядом с названием они забирали 128px из 311 доступных,
                    и на название оставалось 171. Своей строкой они отдают
                    название всю ширину — 279px. Так же устроены свои списки
                    в приложениях Авито и Озона. */}
                <div className="w-full sm:w-auto flex items-center justify-end gap-1 flex-shrink-0">
                  {!isBlocked && task.status === "open" && <TaskStatusActions taskId={task.id} />}
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="h-10 w-10 text-muted-foreground hover:text-brand cursor-pointer"
                  >
                    <Link
                      href={`/dashboard/tasks/${task.id}/edit`}
                      aria-label="Редактировать задание"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
