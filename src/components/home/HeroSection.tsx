import Link from "next/link";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { CityDropdown } from "@/components/shared/CityDropdown";

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-8 md:mb-10 text-foreground/80 font-light">
            Найдите специалиста <br className="hidden sm:inline" />
            <span className="relative inline-block mt-1 sm:mt-2 font-light" style={{ color: '#57C285', padding: '0 0.5rem' }}>
              в Приднестровье
              <span className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-60" />
            </span>
          </h1>

          <div className="mb-8 md:mb-10 max-w-2xl mx-auto">
            {/* Белая плашка формы теперь идеально контрастирует с цветным фоном Hero */}
            <div className="flex flex-col md:flex-row items-stretch bg-card p-2 rounded-2xl md:rounded-full border border-border shadow-xl dark:shadow-black/40 gap-2 md:gap-0">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Мастер на час, ремонт, юрист..."
                  className="w-full pl-12 pr-4 py-3 md:py-4 text-base bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {/* Разделитель */}
              <div className="hidden md:block h-8 my-auto w-px bg-border" />

              {/* Выбор города */}
              <div className="flex items-center px-0 md:px-2">
                <CityDropdown />
              </div>

              {/* Кнопка */}
              <button
                type="button"
                className="px-8 py-3 md:py-4 bg-brand hover:bg-brand/90 text-brand-foreground rounded-xl md:rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-bold text-base cursor-pointer"
              >
                <Search className="h-4 w-4 stroke-[2.5]" />
                <span>Найти</span>
              </button>
            </div>
          </div>

          <p className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-base text-muted-foreground mb-10">
            <span className="text-foreground/80 text-center">
              Нужен исполнитель под конкретную задачу?
            </span>
            <Link
              href="/tasks/new"
              className="text-brand hover:underline transition-colors font-medium bg-brand/5 sm:bg-transparent px-4 py-2 sm:p-0 rounded-full text-center w-full sm:w-auto"
            >
              Создать задание
            </Link>
          </p>

          {/* Статистика */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-4 text-muted-foreground/80 text-sm font-normal tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground/70 font-medium">400+</span>
              <span>исполнителей</span>
            </div>

            <div className="hidden sm:block h-3.5 w-px bg-border/60" />

            <div className="flex items-center gap-1.5">
              <span className="text-foreground/70 font-medium">500+</span>
              <span>объявлений</span>
            </div>

            <div className="hidden sm:block h-3.5 w-px bg-border/60" />

            <div className="flex items-center gap-1.5">
              <span className="text-foreground/70 font-medium">50+</span>
              <span>активных заданий</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}