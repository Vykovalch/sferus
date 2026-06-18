import Link from "next/link";
import { Search, PlusCircle, Users, FileText, Briefcase } from "lucide-react";
import { CityDropdown } from "@/components/shared/CityDropdown";

export function HeroSection() {
  return (
    <section
      className="relative py-16 md:py-32 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(250, 248, 255, 0.85), rgba(250, 248, 255, 0.85)), url('/hero-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Заголовок */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-12 leading-[1.15] text-balance">
            Найдите услугу<br className="hidden sm:inline" />
            <span className="text-primary"> в Приднестровье</span>
          </h1>

          {/* Поисковая панель */}
          <div className="mb-10 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-stretch bg-white/80 backdrop-blur-xl p-2 rounded-xl border border-border shadow-lg gap-2 md:gap-0">
              {/* Поле ввода */}
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ремонт, уборка, репетитор..."
                  className="w-full pl-12 pr-4 py-4 text-base bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
                />
              </div>

              {/* Разделитель */}
              <div className="hidden md:block h-8 my-auto w-px bg-border" />

              {/* Выбор города */}
              <div className="flex items-center px-2 py-1 md:py-0">
                <CityDropdown />
              </div>

              {/* Кнопка поиска */}
              <button
                type="button"
                className="px-10 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-bold text-base cursor-pointer transition-all active:scale-[0.98] shadow-md"
              >
                Найти
              </button>
            </div>
          </div>

          {/* Ссылка на создание задания */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-base mb-14">
            <span className="text-muted-foreground font-medium">
              Нужен исполнитель под конкретную задачу?
            </span>
            <Link
              href="/tasks/new"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/90 font-bold hover:underline underline-offset-4 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Создать задание
            </Link>
          </div>

          {/* Статистика */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white/80">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-foreground">400+</span>
              <span className="text-sm text-muted-foreground font-medium">исполнителей</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white/80">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-foreground">500+</span>
              <span className="text-sm text-muted-foreground font-medium">объявлений</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white/80">
              <Briefcase className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-foreground">50+</span>
              <span className="text-sm text-muted-foreground font-medium">активных заданий</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
