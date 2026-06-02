import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";
import { Heart, MapPin, Eye, MessageSquare, Star, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Фейковые данные сохраненных услуг (Мастеров)
const favoriteServices = [
  {
    id: 1,
    title: "Электромонтажные работы любой сложности",
    providerName: "Алексей К.",
    price: "от 80 руб./час",
    rating: "4.9",
    reviewsCount: 24,
    city: "Тирасполь",
  },
  {
    id: 2,
    title: "Качественный ремонт и обслуживание кондиционеров",
    providerName: "Владимир",
    price: "от 300 руб.",
    rating: "5.0",
    reviewsCount: 12,
    city: "Бендеры",
  },
];

// Фейковые данные сохраненных задач (Клиентов)
const favoriteTasks = [
  {
    id: 1,
    title: "Установить забор из профнастила (около 20 метров)",
    city: "Слободзея",
    budget: "до 2500 руб.",
    responsesCount: 4,
    createdAt: "2 дня назад",
  },
];

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/favorites");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={session.user} />

      <main className="flex-1 min-w-0 p-6 overflow-auto">
        <div className="max-w-5xl">
          {/* Шапка страницы */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Избранное</h1>
            <p className="text-sm text-gray-500">
              Ваши сохраненные услуги специалистов и интересные задания
            </p>
          </div>

          {/* Табы разделения на Услуги и Задания */}
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="bg-gray-100 p-1 mb-6 inline-flex">
              <TabsTrigger value="services" className="text-xs sm:text-sm">
                Сохраненные услуги ({favoriteServices.length})
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs sm:text-sm">
                Интересные задания ({favoriteTasks.length})
              </TabsTrigger>
            </TabsList>

            {/* Контент: Сохраненные Услуги */}
            <TabsContent value="services" className="mt-0">
              {favoriteServices.length === 0 ? (
                <EmptyState
                  title="В избранном пока нет услуг"
                  description="Сохраняйте объявления мастеров, чтобы не потерять их контакты."
                  buttonText="Перейти к каталогу услуг"
                  buttonHref="/services"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-gray-300 transition-all group"
                    >
                      <div>
                        {/* Верхняя часть карточки */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-xs text-gray-400 font-medium truncate">
                            Мастер: {service.providerName}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
                            title="Удалить из избранного"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Заголовок */}
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-[#0d7a5f] line-clamp-2 mb-2">
                          <Link href={`/services/${service.id}`}>{service.title}</Link>
                        </h3>

                        {/* Рейтинг и Локация */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1 text-amber-500 font-medium">
                            <Star className="h-3.5 w-3.5 fill-amber-500" />
                            {service.rating}
                            <span className="text-gray-400 font-normal">
                              ({service.reviewsCount})
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {service.city}
                          </span>
                        </div>
                      </div>

                      {/* Нижняя часть карточки (Цена + Кнопка перехода) */}
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-2">
                        <span className="text-base font-semibold text-[#0d7a5f]">
                          {service.price}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="h-8 px-3 text-xs text-gray-600 hover:text-[#0d7a5f]"
                        >
                          <Link
                            href={`/services/${service.id}`}
                            className="flex items-center gap-1"
                          >
                            Подробнее
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Контент: Сохраненные Задания */}
            <TabsContent value="tasks" className="mt-0">
              {favoriteTasks.length === 0 ? (
                <EmptyState
                  title="В избранном пока нет заданий"
                  description="Если вы ищете подработку, сохраняйте интересные задания из ленты здесь."
                  buttonText="Открыть ленту заданий"
                  buttonHref="/tasks"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {favoriteTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-gray-300 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        {/* Шапка таски */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-gray-400">
                            Опубликовано {task.createdAt}
                          </span>
                        </div>

                        {/* Название */}
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 hover:text-[#0d7a5f] mb-2 line-clamp-1 sm:line-clamp-none">
                          <Link href={`/tasks/${task.id}`}>{task.title}</Link>
                        </h3>

                        {/* Инфо-лайн */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {task.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                            {task.responsesCount} откликов
                          </span>
                        </div>
                      </div>

                      {/* Правая часть: Бюджет и кнопки удаления/перехода */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 flex-shrink-0">
                        <span className="text-base font-semibold text-[#0d7a5f]">
                          {task.budget}
                        </span>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            title="Удалить из избранного"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="h-8 text-xs border-gray-200 text-gray-700"
                          >
                            <Link href={`/tasks/${task.id}`}>Откликнуться</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
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
  /* Компонент пустого состояния с гибкими пропсами */
}
function EmptyState({
  title,
  description,
  buttonText,
  buttonHref,
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center my-2">
      <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-500 mb-4">{description}</p>
      <Button asChild className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white text-xs h-9 shadow-sm">
        <Link href={buttonHref}>{buttonText}</Link>
      </Button>
    </div>
  );
}