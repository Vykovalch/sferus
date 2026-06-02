import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";
import {
  MessageSquare,
  MapPin,
  Search,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Данные откликов текущего специалиста на чужие задания
const myResponses = [
  {
    id: 1,
    taskTitle: "Ремонт стиральной машины Indesit (не сливает воду)",
    customerName: "Игорь В.",
    city: "Бендеры",
    myPrice: "350 руб.",
    status: "pending" as const, // на рассмотрении
    createdAt: "Вчера, 18:20",
    taskId: 101,
  },
  {
    id: 2,
    taskTitle: "Перенос розеток и выключателей в кухне",
    customerName: "Анна Николаевна",
    city: "Тирасполь",
    myPrice: "400 руб.",
    status: "accepted" as const, // принят заказчиком
    createdAt: "3 дня назад",
    taskId: 102,
  },
  {
    id: 3,
    taskTitle: "Разработка лендинга для доставки еды",
    customerName: "Дмитрий",
    city: "Удаленно",
    myPrice: "1200 руб.",
    status: "declined" as const, // отклонен или выбран другой мастер
    createdAt: "1 неделя назад",
    taskId: 103,
  },
];

const statusLabels = {
  pending: "На рассмотрении",
  accepted: "Вы приняты",
  declined: "Отклонен",
};

const statusColors = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  accepted: "bg-green-50 text-green-700 border-green-200/60",
  declined: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle2,
  declined: XCircle,
};

export default async function MyResponsesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/responses");
  }

  // Быстрая статистика для специалиста
  const totalResponses = myResponses.length;
  const acceptedResponses = myResponses.filter((r) => r.status === "accepted").length;
  const pendingResponses = myResponses.filter((r) => r.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={session.user} />

      <main className="flex-1 min-w-0 p-6 overflow-auto">
        <div className="max-w-5xl">
          {/* Шапка страницы */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Мои отклики</h1>
            <p className="text-sm text-gray-500">
              История ваших предложений к заданиям заказчиков и их текущий статус
            </p>
          </div>

          {/* Метрики эффективности откликов */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[11px] sm:text-xs font-medium text-gray-500 mb-1 truncate">
                Всего откликов
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalResponses}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[11px] sm:text-xs font-medium text-gray-500 mb-1 truncate">
                Ожидают ответа
              </p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{pendingResponses}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-[11px] sm:text-xs font-medium text-gray-500 mb-1 truncate">
                Успешные (принятые)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#0d7a5f]">{acceptedResponses}</p>
            </div>
          </div>

          {/* Табы фильтрации */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-gray-100 p-1 mb-4 inline-flex">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                Все
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                Ожидают
              </TabsTrigger>
              <TabsTrigger value="accepted" className="text-xs sm:text-sm">
                Принятые
              </TabsTrigger>
            </TabsList>

            {/* Вкладка: Все */}
            <TabsContent value="all" className="mt-0">
              {myResponses.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="flex flex-col gap-3">
                  {myResponses.map((response) => (
                    <ResponseCard key={response.id} response={response} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Вкладка: Ожидают ответа */}
            <TabsContent value="pending" className="mt-0">
              {myResponses.filter((r) => r.status === "pending").length === 0 ? (
                <EmptyState text="Нет откликов на рассмотрении" />
              ) : (
                <div className="flex flex-col gap-3">
                  {myResponses
                    .filter((r) => r.status === "pending")
                    .map((response) => (
                      <ResponseCard key={response.id} response={response} />
                    ))}
                </div>
              )}
            </TabsContent>

            {/* Вкладка: Принятые */}
            <TabsContent value="accepted" className="mt-0">
              {myResponses.filter((r) => r.status === "accepted").length === 0 ? (
                <EmptyState text="Вас пока еще не выбрали исполнителем" />
              ) : (
                <div className="flex flex-col gap-3">
                  {myResponses
                    .filter((r) => r.status === "accepted")
                    .map((response) => (
                      <ResponseCard key={response.id} response={response} />
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
  /* Компонент карточки отклика */
}
function ResponseCard({ response }: { response: (typeof myResponses)[0] }) {
  const StatusIcon = statusIcons[response.status];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-gray-300 transition-colors">
      <div className="flex-1 min-w-0">
        {/* Инфо-лайн (Статус + Дата публикации отклика) */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border flex items-center gap-1.5 ${statusColors[response.status]}`}
          >
            <StatusIcon className="h-3 w-3 flex-shrink-0" />
            {statusLabels[response.status]}
          </span>
          <span className="text-xs text-gray-400">Отправлено {response.createdAt}</span>
        </div>

        {/* Название задания, на которое откликнулись */}
        <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1.5 line-clamp-1 sm:line-clamp-none">
          {response.taskTitle}
        </h3>

        {/* Данные о заказчике и локации */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="text-gray-700">
            Заказчик: <span className="font-medium">{response.customerName}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {response.city}
          </span>
        </div>
      </div>

      {/* Правая часть: Предложенная цена и кнопка перехода */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 flex-shrink-0">
        <div className="text-left sm:text-right">
          <p className="text-[11px] text-gray-400 mb-0.5">Ваше предложение</p>
          <p className="text-base font-semibold text-[#0d7a5f]">{response.myPrice}</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          asChild
          className="h-8 text-xs border-gray-200 text-gray-700 hover:text-[#0d7a5f] hover:border-[#0d7a5f]/40"
        >
          <Link href={`/tasks/${response.taskId}`}>
            Открыть задачу
            <ArrowUpRight className="h-3.5 w-3.5 ml-1 text-gray-400 group-hover:text-[#0d7a5f]" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

{
  /* Заглушка пустого экрана */
}
function EmptyState({ text = "Вы еще не откликались на задания" }: { text?: string }) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center my-2">
      <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-900 mb-1">{text}</p>
      <p className="text-xs text-gray-500 mb-4">
        Перейдите на ленту задач, чтобы найти подходящую работу.
      </p>
      <Button asChild className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white text-xs h-9">
        <Link href="/tasks" className="flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5" />
          Найти задания
        </Link>
      </Button>
    </div>
  );
}