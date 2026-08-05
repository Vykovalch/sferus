import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, MessageSquare, FileText, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockTasks = [
  { id: 1, title: "Разработка сайта-визитки для стоматологии", budget: "до 800 руб.", responses: 7, status: "open" as const },
  { id: 2, title: "Нужен электрик для замены проводки", budget: "до 500 руб.", responses: 3, status: "in_progress" as const },
  { id: 3, title: "Уборка офиса 200 кв.м.", budget: "до 300 руб./раз", responses: 5, status: "done" as const },
];

const statusLabels = { open: "Открыто", in_progress: "В работе", done: "Завершено" };
const statusColors = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  done: "bg-muted text-muted-foreground",
};

export default async function MyTasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/tasks");

  return (
    <>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-foreground">Мои задания</h1>
          <Button asChild className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer">
            <Link href="/tasks/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Создать
            </Link>
          </Button>
        </div>

        {mockTasks.length === 0 ? (
          <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Нет созданных заданий</p>
            <p className="text-xs text-muted-foreground mb-4">Создайте задание — исполнители откликнутся сами</p>
            <Button asChild variant="outline" className="border-brand text-brand hover:bg-brand/5 cursor-pointer">
              <Link href="/tasks/new">Создать задание</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {mockTasks.map((t) => (
              <div
                key={t.id}
                className="bg-background border border-border rounded-xl p-4 shadow-sm hover:border-brand/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <Link
                    href={`/tasks/${t.id}`}
                    className="text-sm font-medium text-foreground leading-snug hover:text-brand transition-colors"
                  >
                    {t.title}
                  </Link>
                  <span className="text-sm font-bold text-brand whitespace-nowrap flex-shrink-0">{t.budget}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[t.status]}`}>
                      {statusLabels[t.status]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {t.responses} откликов
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="h-8 w-8 text-muted-foreground hover:text-brand cursor-pointer flex-shrink-0"
                  >
                    <Link href={`/dashboard/tasks/${t.id}/edit`}>
                      <Edit3 className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
}
