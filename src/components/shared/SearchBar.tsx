"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { setHeroIntersecting } from "@/components/layout/hero-search-store";
import { CityDropdown } from "@/components/shared/CityDropdown";
import type { CityOption } from "@/features/cities/queries";
import { HEADER_HEIGHT_PX } from "@/lib/constants";

interface SearchBarProps {
  /** Пробрасывается в CityDropdown — данные приходят из серверного компонента. */
  cities: CityOption[];
  placeholder?: string;
  /**
   * Текущий запрос и город из адресной строки.
   *
   * Приходят со страницы уже разобранными, а не читаются здесь через
   * `useSearchParams`: источник состояния — URL, и разбирает его сервер
   * ровно один раз, тем же `parseServiceCatalogFilters`, что и выдачу.
   * Иначе форма и результаты расходились бы по правилам разбора.
   */
  defaultQuery?: string;
  defaultCity?: string;
  /**
   * Только для инстанса в Hero на главной. Включает IntersectionObserver,
   * который пишет видимость этого инпута во внешний стор — на неё реагирует
   * компактный поиск в `Header`. Инстансы на `/services` этот проп не
   * передают, поэтому не наблюдаются и не влияют на стор.
   */
  trackVisibility?: boolean;
}

export function SearchBar({
  cities,
  placeholder = "Ремонт, уборка, репетитор...",
  defaultQuery,
  defaultCity,
  trackVisibility = false,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!trackVisibility) return;
    const input = inputRef.current;
    if (!input) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroIntersecting(entry.isIntersecting),
      // Компенсация высоты sticky-шапки: без неё «пересечение» считается по
      // геометрии вьюпорта, а нужно — по факту, скрылся ли инпут под хедером.
      { rootMargin: `-${HEADER_HEIGHT_PX}px 0px 0px 0px` },
    );
    observer.observe(input);

    return () => {
      observer.disconnect();
      // Возврат к дефолту, чтобы при повторном монтировании Hero (например,
      // после навигации назад на главную) не осталось устаревшее значение.
      setHeroIntersecting(true);
    };
  }, [trackVisibility]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    const city = formData.get("city") as string;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city && city !== "Все города") params.set("city", city);

    router.push(`/services?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-stretch bg-card/80 dark:bg-card/40 backdrop-blur-xl p-2 rounded-2xl md:rounded-3xl border border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-border focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/5 gap-2 md:gap-0"
    >
      <div className="relative flex-1 flex items-center group/input">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-brand" />
        <input
          ref={inputRef}
          name="query"
          type="search"
          defaultValue={defaultQuery}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 text-base bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none font-medium"
        />
      </div>

      <div className="hidden md:block h-8 my-auto w-px bg-gradient-to-b from-transparent via-border to-transparent" />

      <div className="flex items-center px-2 py-1 md:py-0 bg-secondary/10 md:bg-transparent rounded-xl md:rounded-none">
        <CityDropdown cities={cities} defaultCity={defaultCity} />
      </div>

      <button
        type="submit"
        className="px-8 py-3.5 bg-primary text-primary-foreground hover:opacity-90 rounded-xl md:rounded-2xl shadow-[0_4px_12px_rgba(250,84,84,0.2)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 font-semibold text-base cursor-pointer"
      >
        Найти
      </button>
    </form>
  );
}
