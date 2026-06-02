import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Lock, Shield, Eye, Save } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/settings");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={session.user} />

      <main className="flex-1 min-w-0 p-6 overflow-auto">
        <div className="max-w-3xl">
          {/* Шапка страницы */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Настройки аккаунта</h1>
            <p className="text-sm text-gray-500">
              Управление безопасностью, уведомлениями и приватностью вашего профиля
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Секция 1: Уведомления */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <Bell className="h-4 w-4 text-[#0d7a5f]" />
                <h2 className="text-sm font-semibold text-gray-900">Уведомления</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0d7a5f] focus:ring-[#0d7a5f]"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#0d7a5f] transition-colors">
                      Новые отклики на задания
                    </p>
                    <p className="text-xs text-gray-500">
                      Получать уведомления, когда специалисты предлагают свои услуги к вашим задачам
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0d7a5f] focus:ring-[#0d7a5f]"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#0d7a5f] transition-colors">
                      Сообщения из чатов
                    </p>
                    <p className="text-xs text-gray-500">
                      Уведомлять о новых личных сообщениях от клиентов или исполнителей
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0d7a5f] focus:ring-[#0d7a5f]"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#0d7a5f] transition-colors">
                      Уведомления в Telegram
                    </p>
                    <p className="text-xs text-gray-500">
                      Дублировать важные системные события в наш Telegram-бот (требуется привязка)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Секция 2: Безопасность (Смена пароля) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <Lock className="h-4 w-4 text-[#0d7a5f]" />
                <h2 className="text-sm font-semibold text-gray-900">Безопасность и пароль</h2>
              </div>

              <form className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    placeholder="Минимум 8 символов"
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Повторите новый пароль
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f]"
                  />
                </div>

                <Button
                  type="button"
                  size="sm"
                  className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white"
                >
                  Обновить пароль
                </Button>
              </form>
            </div>

            {/* Секция 3: Приватность */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <Eye className="h-4 w-4 text-[#0d7a5f]" />
                <h2 className="text-sm font-semibold text-gray-900">Приватность данных</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0d7a5f] focus:ring-[#0d7a5f]"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#0d7a5f] transition-colors">
                      Показывать мой номер телефона незарегистрированным пользователям
                    </p>
                    <p className="text-xs text-gray-500">
                      Если отключено, ваш телефон из ПМР увидят только авторизованные
                      клиенты/мастера
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0d7a5f] focus:ring-[#0d7a5f]"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#0d7a5f] transition-colors">
                      Отображать статус «В сети»
                    </p>
                    <p className="text-xs text-gray-500">
                      Другие пользователи будут видеть, когда вы заходили на сайт последний раз
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Секция 4: Удаление аккаунта */}
            <div className="bg-red-50/40 border border-red-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-red-600" />
                <h2 className="text-sm font-semibold text-red-900">Опасная зона</h2>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Удаление аккаунта приведет к безвозвратному удалению всех ваших услуг,
                опубликованных заданий, отзывов и истории откликов.
              </p>
              <Button
                size="sm"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Удалить аккаунт
              </Button>
            </div>
          </div>

          {/* Общая кнопка сохранения для чекбоксов */}
          <div className="mt-6 flex justify-end">
            <Button className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white flex items-center gap-2 shadow-sm">
              <Save className="h-4 w-4" />
              Сохранить настройки
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}