import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import Link from "next/link";
import { Megaphone, Eye, MessageSquare, Plus, Edit3, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// В реальном приложении эти данные будут запрашиваться из БД на основе session.user.id
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

export default async function MyServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // Перенаправляем на логин, а после успешного входа возвращаем на текущую страницу
    redirect("/login?callbackUrl=/dashboard/services");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Боковое меню кабинета */}
      <main className="flex-1 min-w-0 p-6 overflow-auto">
        <div className="max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">Мои услуги</h1>
              <p className="text-sm text-gray-500">
                Управление вашими объявлениями и услугами
              </p>
            </div>

            {/* Кнопка создания услуги вынесена в топ для удобства */}
            <Button
              asChild
              className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white self-start sm:self-auto shadow-sm"
            >
              <Link href="/services/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Добавить услугу
              </Link>
            </Button>
          </div>

          {myListings.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center">
              <Megaphone className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                У вас еще нет опубликованных услуг
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Создайте первую услугу, чтобы клиенты могли вас найти.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-[#0d7a5f] text-[#0d7a5f] hover:bg-[#0d7a5f]/5"
              >
                <Link href="/services/new">Создать объявление</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between shadow-sm transition-all hover:shadow-md"
                >
                  <div>
                    {/* Верхняя часть карточки (Иконка + Статус) */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0d7a5f]/10 flex items-center justify-center text-xl font-bold text-[#0d7a5f] flex-shrink-0">
                        {listing.title.charAt(0)}
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          listing.active
                            ? "bg-green-50 text-green-700 border border-green-200/50"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {listing.active ? "Активно" : "Скрыто"}
                      </span>
                    </div>

                    {/* Название и цена */}
                    <h3
                      className="text-base font-semibold text-gray-900 line-clamp-1 mb-1"
                      title={listing.title}
                    >
                      {listing.title}
                    </h3>
                    <p className="text-sm font-medium text-[#0d7a5f] mb-4">{listing.price}</p>
                  </div>

                  {/* Нижняя часть карточки (Статистика + Действия) */}
                  <div className="border-t border-gray-100 pt-4 mt-2 flex items-center justify-between gap-2">
                    {/* Метрики */}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5" title="Просмотры">
                        <Eye className="h-4 w-4 text-gray-400" />
                        {listing.views}
                      </span>
                      <span className="flex items-center gap-1.5" title="Отклики">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        {listing.responses}
                      </span>
                    </div>

                    {/* Кнопки управления услугой */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-gray-900"
                        title={
                          listing.active ? "Деактивировать (скрыть)" : "Активировать (показать)"
                        }
                      >
                        {listing.active ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        asChild
                        className="h-8 w-8 text-gray-500 hover:text-[#0d7a5f]"
                        title="Редактировать услугу"
                      >
                        <Link href={`/services/${listing.id}/edit`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
