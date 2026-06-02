import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Briefcase, Camera, Save, Info } from "lucide-react";

// Список городов ПМР для выбора локации выезда/проживания
const pmrCities = [
  "Тирасполь",
  "Бендеры",
  "Рыбница",
  "Дубоссары",
  "Слободзея",
  "Григориополь",
  "Каменка",
  "Днестровск",
];

export default async function MyProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/profile");
  }

  // Из сессии берем имя пользователя для инициалов
  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "УЗ";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={session.user} />

      <main className="flex-1 min-w-0 p-6 overflow-auto">
        <div className="max-w-4xl">
          {/* Шапка страницы */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Мой профиль</h1>
            <p className="text-sm text-gray-500">
              Управляйте личной информацией, контактами и анкетой специалиста
            </p>
          </div>

          <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Левая колонка: Аватар и быстрые статусы */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full rounded-full object-cover border-2 border-[#0d7a5f]/20"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#0d7a5f]/10 flex items-center justify-center text-2xl font-bold text-[#0d7a5f]">
                      {userInitials}
                    </div>
                  )}
                  {/* Кнопка смены аватара */}
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 shadow-sm rounded-full text-gray-600 hover:text-[#0d7a5f] transition-colors"
                    title="Изменить фото"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="text-base font-semibold text-gray-900 mb-0.5 truncate">
                  {session.user.name}
                </h2>
                <p className="text-xs text-gray-400 mb-3 truncate">{session.user.email}</p>

                <span className="inline-block text-[11px] font-medium bg-[#0d7a5f]/10 text-[#0d7a5f] px-2.5 py-0.5 rounded-full">
                  Клиент & Специалист
                </span>
              </div>

              {/* Информационный блок */}
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 flex gap-2.5">
                <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Заполните блок «О себе» максимально подробно. Заказчики гораздо чаще выбирают
                  мастеров с заполненными анкетами, примерами цен и описанием опыта.
                </p>
              </div>
            </div>

            {/* Правая колонка: Основные поля формы */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Блок 1: Основные данные */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <User className="h-4 w-4 text-[#0d7a5f]" />
                  <h3 className="text-sm font-semibold text-gray-900">Личные данные</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Имя и Фамилия <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={session.user.name}
                      required
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Основной город <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f]"
                      defaultValue="Тирасполь"
                    >
                      {pmrCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Контактный телефон <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+373 (77x) xx-xxx"
                        required
                        className="w-full text-sm pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Никнейм в Telegram (для связи)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-gray-400">@</span>
                      <input
                        type="text"
                        placeholder="username"
                        className="w-full text-sm pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Блок 2: Анкета специалиста */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Briefcase className="h-4 w-4 text-[#0d7a5f]" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Анкета мастера / исполнителя
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Профессиональный статус / Специализация
                  </label>
                  <input
                    type="text"
                    placeholder="Например: Электрик, Репетитор, Компьютерный мастер"
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    О себе и ваших услугах
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Расскажите о своем опыте работы, используемых инструментах, гарантии на услуги и графике работы..."
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0d7a5f] focus:ring-1 focus:ring-[#0d7a5f] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Города, в которых вы готовы работать (выезд мастера)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {pmrCities.map((city) => (
                      <label
                        key={city}
                        className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          value={city}
                          className="h-4 w-4 rounded border-gray-300 text-[#0d7a5f] focus:ring-[#0d7a5f]"
                        />
                        <span className="text-xs text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Кнопка отправки формы */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white flex items-center gap-2 shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  Сохранить изменения
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}