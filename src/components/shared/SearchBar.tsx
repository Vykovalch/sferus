"use client";

import { Search } from "lucide-react";
import Form from "next/form";
import { useEffect, useRef } from "react";
import { useHeroVisibility, useSearchDraft } from "@/components/layout/search-context";
import { CityDropdown } from "@/components/shared/CityDropdown";
import type { CityOption } from "@/features/cities/queries";
import { SEARCH_QUERY_MAX_LENGTH } from "@/features/services/schemas";
import { HEADER_HEIGHT_PX } from "@/lib/constants";

interface SearchBarProps {
  /** Пробрасывается в CityDropdown — данные приходят из серверного компонента. */
  cities: CityOption[];
  placeholder?: string;
  /**
   * Только для инстанса в Hero на главной. Включает IntersectionObserver,
   * который пишет видимость секции Hero в контекст поиска — на неё реагирует
   * компактный поиск в `Header`. Без пропа ничего не наблюдается и на контекст
   * не влияет.
   *
   * Текст и город формы — общий черновик с полем в шапке
   * (`search-context.tsx`): на главной это один поиск в двух положениях.
   */
  trackVisibility?: boolean;
}

export function SearchBar({
  cities,
  placeholder = "Ремонт, уборка, репетитор...",
  trackVisibility = false,
}: SearchBarProps) {
  const { draft, updateDraft } = useSearchDraft();
  const { setHeroVisible } = useHeroVisibility();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!trackVisibility) return;
    // Следим за всей секцией Hero, а не за полем или формой (решение
    // владельца, 2026-09-19): поиск в шапке появляется, только когда первый
    // экран главной ушёл целиком, вместе со строкой «Создать задание». Секция
    // берётся через `closest`, чтобы не заводить ref в HeroSection.
    const section = inputRef.current?.closest("section");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      // Компенсация высоты sticky-шапки: без неё «пересечение» считается по
      // геометрии вьюпорта, а нужно — по факту, скрылась ли секция под шапкой.
      { rootMargin: `-${HEADER_HEIGHT_PX}px 0px 0px 0px` },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      // Возврат к дефолту: провайдер живёт всё время навигации внутри (main),
      // и без сброса после ухода с главной шапка считала бы Hero скрытым.
      setHeroVisible(true);
    };
  }, [trackVisibility, setHeroVisible]);

  // `next/form`, как и в шапке: одна и та же отправка из обоих мест —
  // переход без перезагрузки, работа без JS и одинаковые имена полей
  // (`q`, `city`). Раньше здесь адрес собирался вручную через `router.push`,
  // а шапка отправляла обычную форму с полной перезагрузкой страницы.
  return (
    <Form
      action="/services"
      className="flex flex-col md:flex-row items-stretch bg-card/80 dark:bg-card/40 backdrop-blur-xl p-2 rounded-3xl md:rounded-full border border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 focus-within:border-brand-heading/60 gap-2 md:gap-0"
    >
      <div className="relative flex-1 flex items-center group/input">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-brand-heading" />
        <input
          ref={inputRef}
          name="q"
          type="search"
          value={draft.query}
          onChange={(e) => updateDraft({ query: e.target.value })}
          maxLength={SEARCH_QUERY_MAX_LENGTH}
          aria-label="Поиск услуг"
          placeholder={placeholder}
          // Подсказка — `muted-foreground` без разбавления, как во всех
          // остальных полях сайта. Прежние `/70` осветляли её до 3.5:1 поверх
          // фотографии первого экрана при норме 4.5; без них — 7.0:1.
          className="w-full pl-12 pr-4 py-3.5 text-base bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
        />
      </div>

      <div className="hidden md:block h-8 my-auto w-px bg-gradient-to-b from-transparent via-border to-transparent" />

      <div className="flex items-center px-2 py-1 md:py-0 bg-secondary/10 md:bg-transparent rounded-xl md:rounded-none">
        <CityDropdown
          cities={cities}
          value={draft.city}
          onValueChange={(city) => updateDraft({ city })}
        />
      </div>

      <button
        type="submit"
        className="px-8 py-3.5 bg-brand-fill text-brand-fill-foreground hover:opacity-90 rounded-full transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 font-semibold text-base cursor-pointer"
      >
        Найти
      </button>
    </Form>
  );
}
