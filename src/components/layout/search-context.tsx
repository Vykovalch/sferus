"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useContext, useState } from "react";
import {
  catalogFiltersFromUrl,
  resolveSearchDraft,
  type SearchDraft,
  type StoredDraft,
} from "@/components/layout/search-draft";
import type { ServiceCatalogFilters } from "@/features/services/schemas";

/**
 * Общее состояние поиска для шапки и Hero на главной.
 *
 * На главной это один поиск в двух положениях: поле в шапке появляется ровно
 * тогда, когда форма поиска Hero уходит под неё. Поэтому здесь живут две вещи:
 * - **видимость формы поиска Hero** — по ней шапка решает, показывать ли компактный
 *   поиск;
 * - **черновик** — текст и город, одни на оба поля.
 *
 * Провайдер стоит в `(main)/layout.tsx` и оборачивает и `Header`, и страницу:
 * layout — их общий родитель. Это штатный приём Next.js («Context providers»
 * в документации): страница, переданная как `children`, остаётся серверным
 * компонентом. Раньше здесь были модульные хранилища на `useSyncExternalStore`;
 * они работали, но держали изменяемое состояние на уровне модуля, общего для
 * всех запросов на сервере, — безопасность держалась на аккуратности, а не
 * на устройстве кода.
 */

interface SearchContextValue {
  heroVisible: boolean;
  setHeroVisible: (visible: boolean) => void;
  draft: SearchDraft;
  updateDraft: (patch: Partial<SearchDraft>) => void;
  /** Фильтры каталога из адреса — шапке нужен из них тип исполнителя. */
  filters: ServiceCatalogFilters;
  /**
   * Текущий адрес с параметрами. Шапка привязывает к нему раскрытую панель
   * поиска по лупе: на другом адресе панель закрыта — тем же приёмом, каким
   * здесь к адресу привязана правка черновика.
   */
  urlKey: string;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlKey = `${pathname}?${searchParams.toString()}`;

  // На сервере и при первом рендере Hero считается видимым: в первом HTML
  // главной компактного поиска в шапке нет.
  const [heroVisible, setHeroVisible] = useState(true);
  const [storedDraft, setStoredDraft] = useState<StoredDraft | null>(null);

  // Правка сбрасывается при переходе на другой адрес. Сброс во время рендера,
  // а не в эффекте, — приём из документации React («Adjusting some state when
  // a prop changes»): без лишней отрисовки со старым значением. Без сброса
  // провайдер, который живёт всё время навигации внутри `(main)`, вернул бы
  // давно брошенный текст при возврате на тот же адрес.
  const [trackedUrlKey, setTrackedUrlKey] = useState(urlKey);
  if (trackedUrlKey !== urlKey) {
    setTrackedUrlKey(urlKey);
    setStoredDraft(null);
  }

  const filters = catalogFiltersFromUrl(pathname, searchParams);
  const draft = resolveSearchDraft(storedDraft, urlKey, filters);

  function updateDraft(patch: Partial<SearchDraft>) {
    setStoredDraft({ urlKey, draft: { ...draft, ...patch } });
  }

  return (
    <SearchContext.Provider
      value={{ heroVisible, setHeroVisible, draft, updateDraft, filters, urlKey }}
    >
      {children}
    </SearchContext.Provider>
  );
}

function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("Поиск используется вне SearchProvider — см. (main)/layout.tsx");
  }
  return context;
}

/** Черновик поиска, его правка, фильтры каталога из адреса и сам адрес. */
export function useSearchDraft() {
  const { draft, updateDraft, filters, urlKey } = useSearchContext();
  return { draft, updateDraft, filters, urlKey };
}

/** Видимость формы поиска Hero на главной и её установка (пишет только `SearchBar` в Hero). */
export function useHeroVisibility() {
  const { heroVisible, setHeroVisible } = useSearchContext();
  return { heroVisible, setHeroVisible };
}
