import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  ChevronDown,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/*Фон*/}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg5.png"
          alt="Инструменты и мастерская"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-linear-to-br from-slate-900/80 via-gray-900/75 to-slate-900/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.25)_100%)]" /> */}
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 tracking-tight">
            <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Найдите специалиста{" "}
            </span>
            <span className="relative inline-block text-[#bada77] drop-shadow-[0_0_16px_rgba(186,218,119,0.5)]">
              в Приднестровье
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#bada77] to-transparent opacity-70" />
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/90 mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] max-w-2xl mx-auto">
            Исполнители с отзывами из вашего города — для любой задачи
          </p>

          <div className="mb-6 max-w-4xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#bada77] transition-colors z-10" />
              <input
                type="text"
                placeholder="Найдите нужную услугу или специалиста..."
                className="w-full pl-16 pr-80 py-4 text-base rounded-2xl border-2 border-white/30 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl focus:shadow-2xl focus:border-[#bada77] focus:outline-none transition-all duration-300"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2.5">
                <div className="h-8 w-px bg-gray-300" />
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm rounded-xl bg-transparent hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-all duration-200 cursor-pointer font-medium text-gray-700"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Тирасполь</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <button
                  type="button"
                  className="px-8 py-2.5 bg-[#bada77] hover:bg-[#a8c565] text-[#1a3d2e] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>Найти</span>
                </button>
              </div>
            </div>
          </div>

          {/* Подсказка */}
          <p className="text-xs text-gray-100/60 mb-4">
            Нужен исполнитель под конкретную задачу?{" "}
            <Link
              href="/tasks/new"
              className="text-[#bada77] hover:text-[#a8c565] underline transition-colors font-medium"
            >
              Создать задание
            </Link>
          </p>

          {/* Статистика */}
          <div className="flex items-center justify-center gap-4 text-white/55 text-xs mb-10">
            <span className="font-medium">
              <span className="font-bold">400</span>+ исполнителей
            </span>
            <span className="font-medium">
              <span className="font-bold">500</span>+ объявлений
            </span>
            <span className="font-medium">
              <span className="font-bold">50</span>+ активных заданий
            </span>
          </div>

          {/* Теги категорий */}
          {/* <div className="flex flex-wrap justify-center gap-3 mb-12">
            {heroCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.name}
                  href={`/services?category=${cat.name}`}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-200 opacity-80 hover:opacity-100 ${cat.bg}`}
                >
                  <Icon className="h-4 w-4 text-white/90" />
                  <span className="text-sm font-medium text-white/90">{cat.name}</span>
                </Link>
              )
            })}
          </div> */}
        </div>
      </div>
    </section>
  );
}
