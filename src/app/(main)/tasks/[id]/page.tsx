import { ChevronRight, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactRevealButton } from "@/components/shared/ContactRevealButton";
import { PageContainer } from "@/components/shared/PageContainer";
import { getTaskDetail, getTaskStatsByAuthor } from "@/features/tasks/queries";
import { auth } from "@/lib/auth";
import { TASK_STATUSES, type TaskStatus } from "@/lib/constants";
import { formatRelativeDate, formatTaskBudget } from "@/lib/format";
import { metaDescription } from "@/lib/site";

const statusColors: Record<TaskStatus, string> = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

/** Разбор идентификатора из адреса. Один и тот же для метаданных и страницы. */
function parseTaskId(id: string): number | null {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Метаданные задания.
 *
 * Завершённые и отменённые закрыты от индексации: страница остаётся доступной
 * по ссылке, но в выдаче показывать задание, по которому уже ничего не сделать,
 * — значит приводить людей в тупик. В карту сайта такие тоже не попадают.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const taskId = parseTaskId(id);
  if (taskId === null) return {};

  const task = await getTaskDetail(taskId);
  if (!task) return {};

  const path = `/tasks/${task.id}`;
  const description = metaDescription(task.description);

  return {
    title: task.title,
    description,
    alternates: { canonical: path },
    robots: task.status === "open" ? undefined : { index: false, follow: true },
    openGraph: { title: task.title, description, url: path, type: "article" },
  };
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const taskId = parseTaskId(id);
  if (taskId === null) notFound();

  const task = await getTaskDetail(taskId);
  if (!task) notFound();

  const [session, authorStats] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getTaskStatsByAuthor(task.authorId),
  ]);

  const taskPath = `/tasks/${task.id}`;
  const budgetLabel = formatTaskBudget(task.budget, task.isNegotiable);
  const authorInitials = task.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const contactButton = (className: string) => (
    <ContactRevealButton
      target={{ kind: "task", id: task.id }}
      isAuthenticated={Boolean(session)}
      loginCallbackUrl={taskPath}
      className={className}
    />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <PageContainer className="py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
          >
            <Link
              href="/"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Главная
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60"
            />
            <Link
              href="/tasks"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Задания
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60"
            />
            <span aria-current="page" className="text-foreground font-medium line-clamp-1">
              {task.title}
            </span>
          </nav>
        </PageContainer>
      </div>

      <PageContainer className="py-6 pb-28 lg:pb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4 order-2 lg:order-1">
            <div className="bg-background border border-border rounded-xl p-5 md:p-6 shadow-sm">
              {/* Заголовок + бюджет */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-medium text-foreground tracking-tight leading-tight">
                  {task.title}
                </h1>
                <div className="sm:text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-brand">{budgetLabel}</div>
                </div>
              </div>

              {/* Бейджи */}
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}
                >
                  {TASK_STATUSES[task.status]}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {task.categoryName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <MapPin className="h-3 w-3" />
                  {task.cityName}
                </span>
              </div>

              {/* Описание */}
              <h2 className="text-sm font-medium text-foreground mb-2">Описание задания</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                {task.description}
              </p>

              {/* Детали */}
              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-medium text-foreground mb-3">Детали</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Бюджет</p>
                    <p className="text-sm font-medium text-foreground">{budgetLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Город</p>
                    <p className="text-sm font-medium text-foreground">{task.cityName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Опубликовано</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatRelativeDate(task.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Заказчик — в потоке на мобильном, закреплённый сайдбар на десктопе */}
          <div className="w-full lg:w-60 lg:flex-shrink-0 lg:sticky lg:top-6 order-1 lg:order-2 flex flex-col gap-4">
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <Link
                href={task.authorUsername ? `/profiles/${task.authorUsername}` : "#"}
                className="flex items-center gap-3 mb-3 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-base font-bold text-brand flex-shrink-0">
                  {authorInitials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-brand transition-colors">
                    {task.authorName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Заказчик</p>
                </div>
              </Link>
              <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                <span>
                  Заданий: <span className="font-medium text-foreground">{authorStats.total}</span>
                </span>
                <span>
                  Завершено:{" "}
                  <span className="font-medium text-foreground">{authorStats.completed}</span>
                </span>
              </div>
            </div>

            {/* Действие — только на десктопе, на мобильном закреплённая панель ниже */}
            <div className="hidden lg:flex flex-col bg-background border border-border rounded-xl p-5 shadow-sm">
              <div className="mb-4">
                {contactButton(
                  "w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors",
                )}
              </div>

              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
                <span>Опубликовано {formatRelativeDate(task.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Мобильная закреплённая панель: основное действие */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        {contactButton(
          "w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors",
        )}
      </div>
    </div>
  );
}
