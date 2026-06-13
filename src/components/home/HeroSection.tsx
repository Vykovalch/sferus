import Link from "next/link";
import { Search, PlusCircle, Users, FileText, Briefcase } from "lucide-react";
import { CityDropdown } from "@/components/shared/CityDropdown";

export function HeroSection() {
  return (
    /* Изменено: теперь используется bg-hero-bg вместо bg-background */
    <section className="relative py-16 md:py-32 overflow-hidden bg-hero-bg">
      {/* Ambient Glow Effects — Фоновое свечение в тонах Dori Consultant */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden select-none opacity-50 dark:opacity-20 z-0">
        <div
          className="absolute -top-[20%] left-[20%] w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: "var(--brand) / 10%" }}
        />
        <div
          className="absolute -top-[10%] right-[15%] w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: "var(--brand-heading) / 10%" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Заголовок */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight mb-12 dark:text-foreground font-normal leading-[1.15] text-balance">
            Найдите услугу<br className="hidden sm:inline" />
            <span className="relative inline-block mt-2 font-semibold">в Приднестровье</span>
          </h1>

          {/* Поисковая монолитная панель */}
          <div className="mb-10 max-w-3xl mx-auto px-1 sm:px-0">
            <div className="group flex flex-col md:flex-row items-stretch bg-card/80 dark:bg-card/40 backdrop-blur-xl p-2 rounded-2xl md:rounded-3xl border border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-border focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/5 gap-2 md:gap-0">
              {/* Поле ввода услуги */}
              <div className="relative flex-1 flex items-center group/input">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-brand" />
                <input
                  type="text"
                  placeholder="Ремонт, уборка, репетитор..."
                  className="w-full pl-12 pr-4 py-3.5 text-base bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none font-medium"
                />
              </div>

              {/* Тактильный тонкий разделитель */}
              <div className="hidden md:block h-8 my-auto w-px bg-gradient-to-b from-transparent via-border to-transparent" />

              {/* Выбор города */}
              <div className="flex items-center px-2 py-1 md:py-0 bg-secondary/10 md:bg-transparent rounded-xl md:rounded-none">
                <CityDropdown />
              </div>

              {/* Брендовая кнопка */}
              <button
                type="button"
                className="px-8 py-3.5 bg-primary text-primary-foreground hover:opacity-90 rounded-xl md:rounded-2xl shadow-[0_4px_12px_rgba(250,84,84,0.2)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 font-semibold text-base cursor-pointer"
              >
                <span>Найти</span>
              </button>
            </div>
          </div>

          {/* Интерактивный призыв к действию */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-base mb-14">
            <span className="text-muted-foreground font-medium">
              Нужен исполнитель под конкретную задачу?
            </span>
            <Link
              href="/tasks/new"
              /* Полностью очистили фон и отступы. Теперь это чистая текстовая ссылка, 
     которая при наведении плавно подчеркивается */
              className="inline-flex items-center gap-1.5 text-brand hover:text-brand/90 transition-all font-semibold text-base hover:underline underline-offset-4"
            >
              <PlusCircle className="w-4 h-4" />
              Создать задание
            </Link>
          </div>

          {/* Статистика */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 max-w-2xl mx-auto pt-2">
            {/* Элемент 1 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {/* Изменено: text-brand/80 заменен на text-[var(--brand-heading)] */}
              <Users className="w-4 h-4 text-[var(--brand-heading)] dark:text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-foreground font-bold tracking-tight">400+</span>
                <span className="font-medium">исполнителей</span>
              </div>
            </div>

            {/* Элемент 2 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {/* Изменено: text-brand/80 заменен на text-[var(--brand-heading)] */}
              <FileText className="w-4 h-4 text-[var(--brand-heading)] dark:text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-foreground font-bold tracking-tight">500+</span>
                <span className="font-medium">объявлений</span>
              </div>
            </div>

            {/* Элемент 3 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {/* Изменено: text-brand/80 заменен на text-[var(--brand-heading)] */}
              <Briefcase className="w-4 h-4 text-[var(--brand-heading)] dark:text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-foreground font-bold tracking-tight">50+</span>
                <span className="font-medium">активных заданий</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
