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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-foreground">Мои задания</h1>
        <Button
          asChild
          className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer"
        >
          <Link href="/tasks/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Создать
          </Link>
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Нет созданных заданий</p>
          <p className="text-xs text-muted-foreground mb-4">
            Создайте задание — исполнители сами свяжутся с вами
          </p>
          <Button
            asChild
            variant="outline"
            className="border-brand text-brand hover:bg-brand/5 cursor-pointer"
          >
            <Link href="/tasks/new">Создать задание</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isBlocked = task.moderationStatus !== "approved";

            return (
              <div
                key={task.id}
                className="bg-background border border-border rounded-xl p-4 shadow-sm hover:border-brand/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-sm font-medium text-foreground leading-snug hover:text-brand transition-colors"
                  >
                    {task.title}
                  </Link>
                  <span className="text-sm font-bold text-brand whitespace-nowrap flex-shrink-0">
                    {formatTaskBudget(task.budget, task.isNegotiable)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
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

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!isBlocked && task.status === "open" && <TaskStatusActions taskId={task.id} />}
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                      className="h-8 w-8 text-muted-foreground hover:text-brand cursor-pointer"
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
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
