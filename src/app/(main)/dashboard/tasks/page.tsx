import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";
import { ListChecks, MapPin, MessageSquare, Plus, Eye, MoreVertical, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Исходные данные из вашей БД
const myTasks = [
  {
    id: 1,
    title: "Нужна сиделка для пожилого человека",
    city: "Тирасполь",
    budget: "до 300 руб.",
    responsesCount: 5,
    views: 42,
    status: "open" as const,
    createdAt: "Сегодня, 11:20",
  },
  {
    id: 2,
    title: "Репетитор по математике для дочери",
    city: "Тирасполь",
    budget: "до 150 руб.",
    responsesCount: 3,
    views: 18,
    status: "in_progress" as const,
    createdAt: "Вчера, 16:45",
  },
];

const statusLabels = {
  open: "Открыто",
  in_progress: "В работе",
  done: "Завершено",
};

const statusColors = {
  open: "bg-green-50 text-green-700 border-green-200/60",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200/60",
  done: "bg-gray-100 text-gray-600 border-gray-200",
};

export default async function MyTasksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/tasks");
  }

  // Расчет быстрой статистики по заданиям
  const totalTasks = myTasks.length;
  const openTasks = myTasks.filter((t) => t.status === "open").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={session.user} />

      <main className="flex-1 min-w-0 p-6 overflow-auto">
        <div className="max-w-5xl">
          {/* Шапка страницы */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">Мои задания</h1>
              <p className="text-sm text-gray-500">
                Управляйте опубликованными задачами и ищите исполнителей в ПМР
              </p>
            </div>

            <Button
              asChild
              className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white self-start sm:self-auto shadow-sm"
            >
              <Link href="/tasks/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Опубликовать задание
              </Link>
            </Button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Всего создано</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Ищут исполнителя</p>
              <p className="text-2xl font-bold text-[#0d7a5f]">{openTasks}</p>
            </div>
          </div>

          {/* Табы фильтрации (используем Shadcn Tabs) */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-gray-100 p-1 mb-4 inline-flex">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                Все
              </TabsTrigger>
              <TabsTrigger value="open" className="text-xs sm:text-sm">
                Открытые
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs sm:text-sm">
                В работе
              </TabsTrigger>
              <TabsTrigger value="done" className="text-xs sm:text-sm">
                Завершенные
              </TabsTrigger>
            </TabsList>

            {/* Контент для вкладки "Все" */}
            <TabsContent value="all" className="mt-0">
              {myTasks.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="flex flex-col gap-3">
                  {myTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Контент для вкладки "Открытые" */}
            <TabsContent value="open" className="mt-0">
              {myTasks.filter((t) => t.status === "open").length === 0 ? (
                <EmptyState text="Нет открытых заданий" />
              ) : (
                <div className="flex flex-col gap-3">
                  {myTasks
                    .filter((t) => t.status === "open")
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              )}
            </TabsContent>

            {/* Контент для вкладки "В работе" */}
            <TabsContent value="in_progress" className="mt-0">
              {myTasks.filter((t) => t.status === "in_progress").length === 0 ? (
                <EmptyState text="Нет заданий в процессе выполнения" />
              ) : (
                <div className="flex flex-col gap-3">
                  {myTasks
                    .filter((t) => t.status === "in_progress")
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              )}
            </TabsContent>

            {/* Контент для вкладки "Завершенные" */}
            <TabsContent value="done" className="mt-0">
              {myTasks.filter((t) => t.status === "done").length === 0 ? (
                <EmptyState text="Архив пуст" />
              ) : (
                <div className="flex flex-col gap-3">
                  {myTasks
                    .filter((t) => t.status === "done")
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

{
  /* Компонент карточки задания для чистоты кода */
}
function TaskCard({ task }: { task: (typeof myTasks)[0] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-gray-300 transition-colors">
      <div className="flex-1 min-w-0">
        {/* Статус и дата */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${statusColors[task.status]}`}
          >
            {statusLabels[task.status]}
          </span>
          <span className="text-xs text-gray-400">{task.createdAt}</span>
        </div>

        {/* Название */}
        <h3 className="text-sm sm:text-base font-medium text-gray-900 hover:text-[#0d7a5f] mb-2">
          <Link href={`/tasks/${task.id}`}>{task.title}</Link>
        </h3>

        {/* Инфо-лайн */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {task.city}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-gray-400" />
            {task.views} просмотров
          </span>
          {task.status === "open" && (
            <Link
              href={`/dashboard/tasks/${task.id}/responses`}
              className="flex items-center gap-1 font-medium text-[#0d7a5f] hover:underline"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {task.responsesCount} откликов
            </Link>
          )}
        </div>
      </div>

      {/* Правая часть: Бюджет и действия */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 flex-shrink-0">
        <span className="text-base font-semibold text-[#0d7a5f] sm:text-right">{task.budget}</span>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            asChild
            className="h-8 text-xs border-gray-200 text-gray-700"
          >
            <Link href={`/tasks/${task.id}/edit`}>
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              Изменить
            </Link>
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

{
  /* Компонент заглушки */
}
function EmptyState({ text = "У вас еще нет созданных заданий" }: { text?: string }) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center my-2">
      <ListChecks className="h-8 w-8 text-gray-400 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-900 mb-1">{text}</p>
      <p className="text-xs text-gray-500 mb-4">
        Разместите задачу, чтобы получать предложения от мастеров.
      </p>
    </div>
  );
}