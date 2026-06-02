import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";
import { Megaphone, ListChecks, Star, MessageSquare, Eye, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Активных объявлений",
    value: 3,
    icon: Megaphone,
    color: "text-[#0d7a5f]",
    bg: "bg-[#0d7a5f]/10",
  },
  {
    label: "Открытых заданий",
    value: 2,
    icon: ListChecks,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Средний рейтинг",
    value: "4.9",
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    sub: "127 отзывов",
  },
  {
    label: "Новых откликов",
    value: 3,
    icon: MessageSquare,
    color: "text-red-500",
    bg: "bg-red-50",
    sub: "Требуют внимания",
  },
];

const myListings = [
  {
    id: 1,
    title: "Электромонтажные работы",
    price: "от 80 руб./час",
    views: 45,
    responses: 8,
    active: true,
  },
  {
    id: 2,
    title: "Установка видеонаблюдения",
    price: "от 200 руб.",
    views: 23,
    responses: 3,
    active: true,
  },
  {
    id: 3,
    title: "Подключение электроплит",
    price: "от 50 руб.",
    views: 12,
    responses: 1,
    active: false,
  },
];

const myTasks = [
  {
    id: 1,
    title: "Нужна сиделка для пожилого человека",
    city: "Тирасполь",
    budget: "до 300 руб.",
    responsesCount: 5,
    status: "open" as const,
  },
  {
    id: 2,
    title: "Репетитор по математике для дочери",
    city: "Тирасполь",
    budget: "до 150 руб.",
    responsesCount: 3,
    status: "in_progress" as const,
  },
];

const newResponses = [
  {
    id: 1,
    executorName: "Елена Лазарева",
    executorInitials: "ЕЛ",
    taskTitle: "Нужна сиделка для пожилого человека",
    price: "250 руб.",
  },
  {
    id: 2,
    executorName: "Андрей Михайлов",
    executorInitials: "АМ",
    taskTitle: "Нужна сиделка для пожилого человека",
    price: "280 руб.",
  },
  {
    id: 3,
    executorName: "Ольга Федорова",
    executorInitials: "ОФ",
    taskTitle: "Репетитор по математике для дочери",
    price: "120 руб.",
  },
];

const statusLabels = { open: "Открыто", in_progress: "В работе", done: "Завершено" };
const statusColors = {
  open: "bg-green-50 text-green-700",
  in_progress: "bg-blue-50 text-blue-700",
  done: "bg-gray-100 text-gray-600",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={session.user} />

      <main className="flex-1 min-w-0 p-6 overflow-auto">
        <div className="max-w-5xl">
          {/* Заголовок */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Добро пожаловать, {session.user.name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-gray-500">Вот что происходит с вашим аккаунтом</p>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div
                    className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  {stat.sub && <p className="text-xs text-amber-500 mt-1">{stat.sub}</p>}
                </div>
              );
            })}
          </div>

          {/* Мои объявления */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Мои объявления</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#0d7a5f]/8 flex items-center justify-center text-xl font-bold text-[#0d7a5f]/20 flex-shrink-0">
                    {listing.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate mb-1">
                      {listing.title}
                    </p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${listing.active ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <span className="text-xs text-gray-400">
                        {listing.active ? "Активно" : "Скрыто"} · {listing.price}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {listing.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {listing.responses}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/services/new"
                className="bg-white border border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center gap-2 text-sm text-[#0d7a5f] hover:border-[#0d7a5f] hover:bg-[#0d7a5f]/4 transition-colors"
              >
                + Новое объявление
              </Link>
            </div>
          </div>

          {/* Мои задания */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Мои задания</h2>
            </div>
            <div className="flex flex-col gap-2">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate mb-1">{task.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {task.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {task.responsesCount} откликов
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusColors[task.status]}`}
                  >
                    {statusLabels[task.status]}
                  </span>
                  <span className="text-sm font-semibold text-[#0d7a5f] flex-shrink-0">
                    {task.budget}
                  </span>
                </div>
              ))}
              <Link
                href="/tasks/new"
                className="bg-white border border-dashed border-gray-200 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm text-[#0d7a5f] hover:border-[#0d7a5f] hover:bg-[#0d7a5f]/4 transition-colors"
              >
                + Создать задание
              </Link>
            </div>
          </div>

          {/* Новые отклики */}
          {newResponses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Новые отклики на мои задания
                  <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {newResponses.length}
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {newResponses.map((response) => (
                  <div
                    key={response.id}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0d7a5f]/10 flex items-center justify-center text-xs font-bold text-[#0d7a5f] flex-shrink-0">
                      {response.executorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{response.executorName}</p>
                      <p className="text-xs text-gray-400 truncate">
                        На задание: {response.taskTitle}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#0d7a5f] flex-shrink-0">
                      {response.price}
                    </span>
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs bg-[#0d7a5f] hover:bg-[#0a6149] text-white flex-shrink-0"
                    >
                      Принять
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-7 px-3 text-xs border-[#0d7a5f] text-[#0d7a5f] flex-shrink-0"
                    >
                      <Link href={`/profile/${response.executorName}`}>Профиль</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
