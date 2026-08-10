import Link from "next/link";
import { ChevronRight, MapPin, Clock, Users, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { RespondButton } from "@/features/tasks/components/RespondButton";

type TaskStatus = "open" | "in_progress" | "done";

const mockTask = {
  id: 1,
  title: "Разработка сайта-визитки для стоматологии",
  description:
    'Нужен современный сайт для стоматологической клиники. Требования: адаптивный дизайн, страницы "О нас", "Услуги", "Врачи", "Контакты". Форма записи на приём. Срок — 2 недели. Есть примеры нравящихся сайтов которые пришлю после обсуждения. Предпочтительно работать с исполнителем из Тирасполя для личных встреч.',
  budget: "до 800 руб.",
  category: "IT и Digital",
  city: "Тирасполь",
  deadline: "2 недели",
  status: "open" as TaskStatus,
  createdAt: "5 часов назад",
  userId: "user_123",
  author: {
    username: "marina-kovaleva",
    name: "Марина Ковалёва",
    initials: "МК",
    memberSince: "марта 2025",
    tasksCount: 5,
    completedCount: 3,
  },
  responses: [
    {
      id: 1,
      userId: "user_456",
      author: { name: "Дмитрий Ковалёв", initials: "ДК", rating: 4.9, reviewsCount: 43 },
      price: "600 руб.",
      text: "Занимаюсь разработкой сайтов 5 лет. Сделаю современный адаптивный сайт с формой записи. Могу показать примеры похожих работ. Готов встретиться лично для обсуждения деталей.",
    },
    {
      id: 2,
      userId: "user_789",
      author: { name: "Александр М.", initials: "АМ", rating: 4.7, reviewsCount: 28 },
      price: "750 руб.",
      text: "Могу выполнить работу за 10 дней. Использую современный стек — Next.js, Tailwind. SEO оптимизация в комплекте.",
    },
  ],
  similarTasks: [
    { id: 2, title: "Лендинг для строительной компании", city: "Тирасполь", budget: "до 500 руб." },
    { id: 3, title: "Интернет-магазин на WordPress", city: "Бендеры", budget: "до 1200 руб." },
  ],
};

const statusLabels: Record<TaskStatus, string> = {
  open: "Открыто",
  in_progress: "В работе",
  done: "Завершено",
};

// Изменено: Используем семантические цвета темы
const statusColors: Record<TaskStatus, string> = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  done: "bg-muted text-muted-foreground",
};

export default async function TaskDetailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = session?.user.id ?? null;
  const isOwner = currentUserId === mockTask.userId;
  const hasResponded = mockTask.responses.some((r) => r.userId === currentUserId);
  const myResponse = mockTask.responses.find((r) => r.userId === currentUserId);

  // Общий CTA для сайдбара (десктоп) и закреплённой панели (мобильный) — одна логика, два места показа
  const respondCta =
    !isOwner && !hasResponded ? (
      session ? (
        <RespondButton taskId={mockTask.id} className="w-full" />
      ) : (
        <Button
          asChild
          className="w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors"
        >
          <Link href={`/login?callbackUrl=/tasks/${mockTask.id}`}>Откликнуться</Link>
        </Button>
      )
    ) : null;

  const respondedBadge =
    !isOwner && hasResponded ? (
      <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg">
        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          Вы откликнулись
        </span>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link
              href="/tasks"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Задания
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />
            <span aria-current="page" className="text-foreground font-medium line-clamp-1">{mockTask.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-28 lg:pb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4 order-2 lg:order-1">
            {/* Основной блок */}
            <div className="bg-background border border-border rounded-xl p-5 md:p-6 shadow-sm">
              {/* Заголовок + бюджет */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-medium text-foreground tracking-tight leading-tight">
                  {mockTask.title}
                </h1>
                <div className="sm:text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-brand">{mockTask.budget}</div>
                </div>
              </div>

              {/* Бейджи */}
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[mockTask.status]}`}
                >
                  {statusLabels[mockTask.status]}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {mockTask.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <MapPin className="h-3 w-3" />
                  {mockTask.city}
                </span>
              </div>

              {/* Описание */}
              <h2 className="text-sm font-medium text-foreground mb-2">Описание задания</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {mockTask.description}
              </p>

              {/* Детали */}
              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-medium text-foreground mb-3">Детали</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Бюджет</p>
                    <p className="text-sm font-medium text-foreground">{mockTask.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Срок</p>
                    <p className="text-sm font-medium text-foreground">{mockTask.deadline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Город</p>
                    <p className="text-sm font-medium text-foreground">{mockTask.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Блок откликов */}
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              {/* Автор задания — видит все отклики */}
              {isOwner && (
                <>
                  <h2 className="text-sm font-medium text-foreground mb-4">
                    Отклики ({mockTask.responses.length})
                  </h2>
                  <div className="flex flex-col gap-3">
                    {mockTask.responses.map((response) => (
                      <div
                        key={response.id}
                        className="border border-border rounded-xl p-4 hover:border-brand/50 transition-colors bg-card/50"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-xs font-bold text-brand flex-shrink-0">
                              {response.author.initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {response.author.name}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-foreground font-medium">
                                  {response.author.rating}
                                </span>
                                <span>· {response.author.reviewsCount} отзывов</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-base font-bold text-brand flex-shrink-0">
                            {response.price}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {response.text}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="h-8 px-4 text-xs bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors"
                          >
                            Принять отклик
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="h-8 px-4 text-xs border-input hover:bg-muted text-foreground cursor-pointer font-medium transition-colors"
                          >
                            <Link href={`/profile/${response.userId}`}>Профиль</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Исполнитель уже откликнулся */}
              {!isOwner && hasResponded && myResponse && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <h2 className="text-sm font-medium text-foreground">Вы уже откликнулись</h2>
                  </div>
                  <div className="border border-brand/20 rounded-xl p-4 bg-brand/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">Ваш отклик</p>
                      <span className="text-sm font-bold text-brand">{myResponse.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {myResponse.text}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-4 text-xs border-input hover:bg-muted text-foreground cursor-pointer font-medium transition-colors"
                    >
                      Редактировать отклик
                    </Button>
                  </div>
                </>
              )}

              {/* Гость или пользователь без отклика */}
              {!isOwner && !hasResponded && (
                <>
                  <h2 className="text-sm font-medium text-foreground mb-1">
                    Откликов: {mockTask.responses.length}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Откликнитесь на задание чтобы предложить свои условия заказчику
                  </p>
                  {!session ? (
                    <Button
                      asChild
                      className="bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors"
                    >
                      <Link href={`/login?callbackUrl=/tasks/${mockTask.id}`}>
                        Войдите чтобы откликнуться
                      </Link>
                    </Button>
                  ) : (
                    <RespondButton taskId={mockTask.id} />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Заказчик — в потоке на мобильном, закреплённый сайдбар на десктопе */}
          <div className="w-full lg:w-60 lg:flex-shrink-0 lg:sticky lg:top-6 order-1 lg:order-2 flex flex-col gap-4">
            {/* Карточка заказчика */}
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <Link
                href={`/profiles/${mockTask.author.username}`}
                className="flex items-center gap-3 mb-3 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-base font-bold text-brand flex-shrink-0">
                  {mockTask.author.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-brand transition-colors">
                    {mockTask.author.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Заказчик</p>
                </div>
              </Link>
              <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                <span>
                  Заданий: <span className="font-medium text-foreground">{mockTask.author.tasksCount}</span>
                </span>
                <span>
                  Завершено: <span className="font-medium text-foreground">{mockTask.author.completedCount}</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                На платформе с {mockTask.author.memberSince}
              </p>
            </div>

            {/* Действие + мета-информация — только на десктопе, на мобильном заменяется закреплённой панелью */}
            <div className="hidden lg:flex flex-col bg-background border border-border rounded-xl p-5 shadow-sm">
              {respondCta && <div className="mb-4">{respondCta}</div>}
              {respondedBadge && <div className="mb-4">{respondedBadge}</div>}

              {/* Мета-информация */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
                  <span>Опубликовано {mockTask.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
                  <span>{mockTask.responses.length} откликов</span>
                </div>
              </div>

              {/* Похожие задания */}
              {mockTask.similarTasks.length > 0 && (
                <div className="border-t border-border mt-4 pt-4">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Похожие задания
                  </p>
                  <div className="flex flex-col gap-2">
                    {mockTask.similarTasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/tasks/${task.id}`}
                        className="block p-3 border border-border rounded-lg hover:border-brand/40 bg-card/30 transition-colors group cursor-pointer"
                      >
                        <p className="text-xs font-medium text-foreground group-hover:text-brand transition-colors mb-1 line-clamp-2">
                          {task.title}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{task.city}</span>
                          <span className="text-brand font-medium">{task.budget}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная закреплённая панель: основное действие */}
      {(respondCta || respondedBadge) && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background border-t border-border px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
          {respondCta ?? respondedBadge}
        </div>
      )}
    </div>
  );
}