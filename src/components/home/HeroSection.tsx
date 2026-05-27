import Link from "next/link";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { CityDropdown } from "@/components/shared/CityDropdown";

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden bg-background border-b border-border">
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-muted/50 via-muted/20 to-background overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[-20%] left-[30%] w-[800px] h-[350px] rounded-full bg-brand/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/60 to-transparent z-1" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-8 md:mb-10 text-foreground/80 font-light">
            Найдите специалиста <br className="hidden sm:inline" />
            <span className="relative inline-block mt-1 sm:mt-2 font-semibold text-foreground">
              в Приднестровье
              <span className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-60" />
            </span>
          </h1>

          <div className="mb-8 md:mb-10 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-stretch bg-background p-2 rounded-2xl md:rounded-full border border-border shadow-xl dark:shadow-black/40 gap-2 md:gap-0">
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

              <button
                type="button"
                className="px-8 py-3 md:py-4 bg-ring hover:bg-ring/90 text-primary-foreground rounded-xl md:rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-bold text-base cursor-pointer"
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
