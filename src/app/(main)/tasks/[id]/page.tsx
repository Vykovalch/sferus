import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactRevealButton } from "@/components/shared/ContactRevealButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { PageContainer } from "@/components/shared/PageContainer";
import { getFavoriteId } from "@/features/favorites/queries";
import { getTaskDetail, getTaskStatsByAuthor } from "@/features/tasks/queries";
import { auth } from "@/lib/auth";
import { TASK_STATUSES } from "@/lib/constants";
import { formatRelativeDate, formatTaskBudget } from "@/lib/format";
import { metaDescription } from "@/lib/site";

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

  // Зависит от session.user.id — не может уйти в тот же Promise.all выше.
  const isFavorite = session?.user?.id
    ? (await getFavoriteId(session.user.id, "task", task.id)) !== null
    : false;

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

  // Карточка заказчика: ссылкой, если у него есть публичный профиль.
  // Раньше при отсутствии `username` в разметке оставался `href="#"` —
  // ссылка в никуда.
  const authorCard = (
    <>
      <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-base font-bold text-brand flex-shrink-0">
        {authorInitials}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-brand transition-colors">
          {task.authorName}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Заказчик</p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer className="pt-6 pb-28 lg:pt-8 lg:pb-8">
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
          className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap mb-3"
        >
          <Link href="/" className="hover:text-brand transition-colors cursor-pointer font-medium">
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
        {/* Порядок в разметке и есть порядок на телефоне: сначала задание,
            потом панель заказчика (2026-09-30). До этого у них стояли
            `order-1` / `order-2`, и на телефоне первым шёл блок заказчика —
            аватар, имя и счётчик заданий. Кнопка контактов в нём на телефоне
            скрыта (она в закреплённой полосе внизу), то есть блок без действия
            отодвигал заголовок и описание вниз. На широком экране порядок
            тот же: содержимое слева, панель справа. */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
              {/* В строке заголовка остались заголовок и отметка «в избранное».
                  Бюджет переехал в панель действия: там он стоит рядом
                  с кнопкой, как в закреплённой полосе на телефоне. */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight leading-tight">
                  {task.title}
                </h1>
                <FavoriteButton
                  target={{ kind: "task", id: task.id }}
                  isFavorite={isFavorite}
                  isAuthenticated={!!session}
                  className="flex-shrink-0 p-2 rounded-full border border-border hover:border-brand/50 transition-colors"
                />
              </div>

              {/* Категория — простой текст, не бейдж: единственное место на
                  странице, где она вообще показана (в крошках задания её
                  нет, в отличие от услуги). */}
              <p className="text-sm text-muted-foreground mb-6">{task.categoryName}</p>

              {/* Описание — главный текст страницы, поэтому 16px основным
                  цветом (2026-09-30). До этого стояли 14px `--muted-foreground`,
                  то есть стиль служебной подписи. */}
              <h2 className="text-base font-semibold text-foreground mb-2">Описание задания</h2>
              <p className="text-base text-foreground leading-relaxed mb-6 whitespace-pre-line">
                {task.description}
              </p>

              {/* Детали */}
              <div className="border-t border-border pt-5">
                <h2 className="text-base font-semibold text-foreground mb-3">Детали</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Статус</p>
                    <p className="text-sm font-medium text-foreground">
                      {TASK_STATUSES[task.status]}
                    </p>
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

          {/* Бюджет, действие и заказчик.
              `lg:top-24` — 96px: высота шапки 72 (`HEADER_HEIGHT_PX`,
              `lg:h-[72px]` в `Header.tsx`) плюс 24 воздуха. При прежних
              `lg:top-6` закреплённая панель прилипала под закреплённой шапкой,
              и её верхние 48px скрывались за ней. */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="text-2xl font-semibold text-foreground leading-tight">
                {budgetLabel}
              </div>

              {contactButton(
                "mt-4 hidden lg:flex w-full h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground cursor-pointer font-medium transition-colors",
              )}

              <div className="mt-4 pt-4 border-t border-border">
                {task.authorUsername ? (
                  <Link
                    href={`/profiles/${task.authorUsername}`}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    {authorCard}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">{authorCard}</div>
                )}

                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    Заданий:{" "}
                    <span className="font-medium text-foreground">{authorStats.total}</span>
                  </span>
                  <span>
                    Завершено:{" "}
                    <span className="font-medium text-foreground">{authorStats.completed}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Мобильная закреплённая панель. Бюджет добавлен в неё вместе
          с переносом его в панель действия (2026-09-30): иначе на телефоне
          сумма оказалась бы в самом низу страницы, под описанием и деталями.
          Теперь полоса устроена так же, как на странице услуги: сумма слева,
          кнопка справа. */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-card border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-lg font-semibold text-foreground leading-tight">{budgetLabel}</div>
        </div>
        {contactButton(
          "flex-shrink-0 h-10 rounded-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground cursor-pointer font-medium transition-colors",
        )}
      </div>
    </div>
  );
}
