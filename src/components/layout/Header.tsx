"use client";

import { Heart, Search, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateListingMenu } from "@/components/layout/CreateListingMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useHeroVisibility, useSearchDraft } from "@/components/layout/search-context";
import { UserMenu } from "@/components/layout/UserMenu";
import { CityDropdown } from "@/components/shared/CityDropdown";
import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";
import type { CityOption } from "@/features/cities/queries";
import { SEARCH_QUERY_MAX_LENGTH } from "@/features/services/schemas";
import type { Session } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface HeaderProps {
  session: Session | null; // Сессия из серверного layout (auth.api.getSession)
  /** Города из БД для выбора в поиске — приходят из серверного layout. */
  cities: CityOption[];
}

export function Header({ session, cities }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Поиск в шапке. Текст и город — общий черновик с Hero на главной
  // (search-context.tsx): пока человек ничего не менял, это значения
  // из адреса, поэтому на `/services` в поле уже стоят запрос и город
  // выполненного поиска.
  //
  // Тип исполнителя в черновике не участвует — его выбирают в сайдбаре
  // результатов, а здесь он уходит скрытым полем, чтобы новый запрос
  // из шапки не сбрасывал фильтр, который человек видит плашкой над выдачей.
  const { draft, updateDraft, filters, urlKey } = useSearchDraft();

  const searchInputProps = {
    name: "q",
    type: "search",
    value: draft.query,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      updateDraft({ query: event.target.value }),
    maxLength: SEARCH_QUERY_MAX_LENGTH,
    // Короткое слово вместо примеров (решение владельца, 2026-09-19): примеры
    // «Ремонт, уборка, репетитор...» в поле шапки обрезались до «…репет».
    // Примеры остались в поиске Hero, где человек впервые решает, что искать.
    placeholder: "Поиск...",
    // Клавиша отправки на экранной клавиатуре подписана «Найти» / «Поиск»,
    // а не «↵»: на телефоне поиск отправляют в основном ею.
    enterKeyHint: "search",
  } as const;

  const executorTypeField = filters.executorType && (
    <input type="hidden" name="type" value={filters.executorType} />
  );

  function selectCity(city: string | undefined) {
    updateDraft({ city });
  }

  // Видимость формы поиска Hero приходит из контекста поиска, за ней следит SearchBar
  // в Hero (см. search-context.tsx). На остальных страницах Hero нет,
  // поэтому источник неважен — компактный поиск виден всегда.
  const { heroVisible } = useHeroVisibility();
  const showCompactSearch = isHome ? !heroVisible : true;

  // Раскрытие лупы в полноширинную строку поиска ниже xl (см. ниже) —
  // локальное состояние одного компонента: в отличие от видимости Hero
  // и черновика, об этом не нужно договариваться с другими компонентами.
  //
  // Хранится не «открыто: да/нет», а адрес, на котором панель открыли
  // (2026-09-19). Шапка живёт в layout и переживает переходы, и булев флаг
  // оставлял панель открытой на новой странице — после клика по карточке
  // под ней или после «Найти» над выдачей. Смена адреса сбрасывает его во
  // время рендера, тем же приёмом, что правку черновика в search-context.tsx:
  // без эффекта и без кадра, где панель ещё висит на новой странице.
  const [mobileSearchUrlKey, setMobileSearchUrlKey] = useState<string | null>(null);
  if (mobileSearchUrlKey !== null && mobileSearchUrlKey !== urlKey) {
    setMobileSearchUrlKey(null);
  }
  const isMobileSearchOpen = mobileSearchUrlKey !== null;
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchPanelRef = useRef<HTMLDivElement>(null);

  // Панель, которую открыл человек, закрывает только человек (2026-09-19):
  // крестик, Escape, нажатие мимо, прокрутка колёсиком, «Найти», переход
  // на другую страницу. Раньше она закрывалась и сама — когда форма Hero
  // снова оказывалась на виду. На телефоне это срабатывало ложно: курсор
  // в поле возвращает спрятанную адресную строку браузера, видимая область
  // сдвигается, край формы Hero выглядывает — и панель закрывалась, едва
  // открывшись. Закрытие по геометрии экрана убрано: WCAG 3.2
  // («Предсказуемость») — интерфейс не меняется сам, пока человек с ним
  // работает. Выглянувший край Hero на телефоне остаётся под панелью.
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    // preventScroll: сам вызов фокуса не должен прокручивать страницу.
    mobileSearchInputRef.current?.focus({ preventScroll: true });
    function handleKeyDown(event: KeyboardEvent) {
      // Escape в открытом списке городов закрывает только список: Radix
      // обрабатывает его раньше и помечает событие `preventDefault`.
      if (event.defaultPrevented) return;
      if (event.key === "Escape") setMobileSearchUrlKey(null);
    }
    // «Лёгкое закрытие»: нажатие мимо панели закрывает её, а само нажатие
    // срабатывает как обычно — ссылка открывается, кнопка нажимается.
    // Оверлей, который сначала пришлось бы закрыть, намеренно не делали.
    //
    // Прокрутка колёсиком или тачпадом — такое же действие человека: без неё
    // на планшете и ноутбуке можно было докрутить до Hero с открытой панелью
    // и увидеть два поиска. Прокрутка пальцем начинается с касания мимо
    // панели и закрывает её через pointerdown.
    function dismissFromOutside(event: Event) {
      const panel = mobileSearchPanelRef.current;
      if (!panel || panel.contains(event.target as Node)) return;
      // Открыт список городов: он в портале, вне панели. Выбор города
      // и прокрутка списка не должны закрывать поиск, а первое нажатие мимо
      // закрывает только список — так ведёт себя меню Radix.
      if (panel.querySelector('[data-state="open"]')) return;
      setMobileSearchUrlKey(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", dismissFromOutside);
    document.addEventListener("wheel", dismissFromOutside, { passive: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", dismissFromOutside);
      document.removeEventListener("wheel", dismissFromOutside);
    };
  }, [isMobileSearchOpen]);

  // Ваши ссылки навигации
  const navLinks = [
    { href: "/services", label: "Услуги" },
    { href: "/tasks", label: "Задания" },
    { href: "/#how-it-works", label: "Как это работает" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-hero-bg/95 backdrop-blur-md">
      {/* Раскрытый поиск по лупе (ниже xl). Полностью заменяет собой
          остальное содержимое хедера на время поиска — логотип, навигация
          и меню всё равно не нужны в этот момент. При xl+ этой панели
          никогда не место (xl:hidden) — на случай, если состояние осталось
          true при ресайзе окна. Высота на md и lg — как у шапки (64 / 72px).

          Панель — слой поверх шапки (absolute), а не блок в потоке
          (2026-09-19). На телефоне она в две строки и выше шапки на ~56px:
          в потоке шапка росла и сдвигала всю страницу вниз, поиск Hero
          снова оказывался на виду, и тогдашнее автозакрытие по видимости
          Hero (позже убрано — см. эффект выше) закрывало панель: она мелькала
          и пряталась. Теперь шапка в потоке не меняет высоту (основная строка
          при открытой панели invisible, а не hidden), а вторая строка панели
          на время поиска перекрывает верх страницы. */}
      {isMobileSearchOpen && (
        <div
          ref={mobileSearchPanelRef}
          className="xl:hidden absolute inset-x-0 top-0 border-b border-border bg-hero-bg"
        >
          <PageContainer>
            {/* Правило (решение владельца, 2026-09-17): поле поиска в шапке всегда
                с выбором города. Где полному полю не хватает места — до 1280px —
                вместо него лупа, и она раскрывает именно полный поиск.

                Город на телефоне — второй строкой во всю ширину: на 375px поле
                сжалось бы примерно до 150px, а кнопке выбора нужна область касания
                около 44px. От 768px ширины хватает, и город встаёт в одну строку
                с полем. Выбор города один на обе раскладки (перенос через
                flex-wrap и order), а не два экземпляра: каждый CityDropdown
                рендерит скрытое поле `city`, и в адресе появилось бы два `city`.

                Кнопка «Найти» — рядом с городом (2026-09-19): без неё запрос уходил
                только по Enter, а выбор города закрывает экранную клавиатуру —
                отправить было нечем. На телефоне она во второй строке, в зоне
                большого пальца; от 768px — в общей строке перед крестиком.
                Автоматического поиска при выборе города нет по-прежнему (решение
                владельца). Заливка цветом бренда не спорит с «Найти» в Hero: на
                главной эта панель доступна, только когда Hero ушёл за экран. */}
            <Form
              action="/services"
              className="flex flex-wrap items-center gap-x-2 gap-y-3 py-3 md:py-0 md:h-16 lg:h-[72px]"
            >
              <label htmlFor="mobile-header-search" className="sr-only">
                Поиск услуг
              </label>
              <div className="relative flex-1 min-w-0">
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                />
                <input
                  ref={mobileSearchInputRef}
                  id="mobile-header-search"
                  {...searchInputProps}
                  className="w-full h-10 pl-9 pr-3 text-sm bg-background border border-input rounded-full text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-brand-heading/60 transition-colors"
                />
              </div>
              <div className="order-last basis-full flex gap-2 md:order-none md:basis-auto">
                <div className="flex-1 min-w-0 md:flex-none">
                  <CityDropdown
                    cities={cities}
                    value={draft.city}
                    onValueChange={selectCity}
                    variant="block"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 h-11 md:h-10 px-5 rounded-full bg-brand-fill text-brand-fill-foreground hover:bg-brand-fill/90 text-sm font-semibold transition-colors"
                >
                  Найти
                </button>
              </div>
              <button
                type="button"
                aria-label="Закрыть поиск"
                onClick={() => setMobileSearchUrlKey(null)}
                className="shrink-0 text-foreground hover:text-primary transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
              {executorTypeField}
            </Form>
          </PageContainer>
        </div>
      )}

      <PageContainer>
        <div
          className={cn(
            "flex h-16 lg:h-[72px] items-center gap-4",
            isMobileSearchOpen && "invisible xl:visible",
          )}
        >
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Левая часть: бургер (только на узких экранах) и логотип Sferus.
                Бургер слева от логотипа — решение владельца, 2026-09-17; меню
                выезжает с той же стороны (MobileMenu, side="left"). */}
            <div className="flex items-center gap-3">
              <MobileMenu />
              <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
                <Logo className="text-2xl" />
              </Link>
            </div>

            {/* Поиск.
                `next/form`: GET-форма, которая отправляется и без JS, а с JS
                переходит без перезагрузки страницы. Отправленный поиск живёт
                в адресной строке — тот же принцип, по которому фильтры
                каталога сделаны ссылками. Hero на главной отправляет ровно
                такую же форму.

                Поле — с xl (1280px) и всегда вместе с выбором города и кнопкой
                «Найти»: поле без города — урезанный поиск, без кнопки — поиск
                только по Enter. До xl вместо формы — лупа, разворачивающая ту же
                строку поиска на всю ширину шапки (см. isMobileSearchOpen выше).

                История границы: 2026-09-17 владелец экспериментом опустил её
                с xl до lg (1024px). Замер критики главной (2026-09-19) показал:
                на 1024px даже у гостя полю оставалось 101px при 139px выбора
                города — виден только обрывок запроса. Граница возвращена на xl
                (решение владельца, 2026-09-19); туда же добавлена кнопка «Найти»,
                как в Hero и в панели по лупе. Поле на главной по-прежнему открыто,
                а не за лупой: поиск — главное действие площадки, и где для поля
                есть место, прятать его не нужно.

                Sticky-поведение (только на главной): пока в Hero видна его
                собственная форма поиска, здесь этого блока нет — появляется
                плавно (opacity + max-width), когда форма Hero скрывается под
                шапкой, и уходит обратно при скролле вверх. На остальных
                страницах Hero нет, поэтому блок виден сразу и без анимации —
                transition-классы навешиваются только когда isHome, иначе при
                переходе с главной (где он был скрыт) на другую страницу он бы
                «доезжал» с анимацией вместо мгновенного появления.

                inert, пока блок скрыт: opacity и max-w-0 прячут его только
                от глаз, а поле и выбор города оставались в порядке Tab —
                с клавиатуры фокус уходил в невидимые элементы, и печатать
                можно было вслепую. inert убирает их и из обхода, и из дерева
                доступности. */}
            <search
              inert={!showCompactSearch}
              className={cn(
                "hidden xl:flex flex-1 items-center overflow-hidden",
                isHome && "transition-[opacity,max-width] duration-300 ease-out",
                showCompactSearch
                  ? "opacity-100 max-w-md"
                  : "opacity-0 max-w-0 pointer-events-none",
              )}
            >
              <Form
                action="/services"
                className="flex w-full h-10 items-center relative bg-background border border-input rounded-full transition-colors focus-within:border-brand-heading/60"
              >
                <label htmlFor="header-search" className="sr-only">
                  Поиск услуг
                </label>
                <Search
                  aria-hidden="true"
                  className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"
                />
                <input
                  id="header-search"
                  {...searchInputProps}
                  className="min-w-0 flex-1 h-full pl-9 pr-3 text-sm bg-transparent rounded-full text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
                />
                <div className="flex items-center shrink-0 pr-1">
                  <div aria-hidden="true" className="h-5 w-px bg-border mr-1" />
                  <CityDropdown
                    cities={cities}
                    value={draft.city}
                    onValueChange={selectCity}
                    variant="compact"
                  />
                  <button
                    type="submit"
                    className="ml-1 h-8 px-4 rounded-full bg-brand-fill text-brand-fill-foreground hover:bg-brand-fill/90 text-sm font-semibold transition-colors"
                  >
                    Найти
                  </button>
                </div>
                {executorTypeField}
              </Form>
            </search>

            {/* Лупа до xl подчиняется тому же правилу, что и
                компактная форма выше: не главная страница, либо форма Hero
                уже скрылась при скролле. Без этого условия на главной, пока
                Hero-строка поиска ещё видна, лупа в хедере дублировала бы её.
                По клику не переходит никуда — раскрывает строку поиска прямо
                в хедере (см. isMobileSearchOpen выше), раньше вела на
                /services, где после недавней правки поля поиска больше нет. */}
            {showCompactSearch && (
              <button
                type="button"
                aria-label="Найти услугу"
                aria-expanded={isMobileSearchOpen}
                onClick={() => setMobileSearchUrlKey(urlKey)}
                className="xl:hidden text-foreground hover:text-primary transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* Центр: Навигация (Inter, 14px, ховер перекрашивает в цвет бренда
                --primary). Цвет бренда только на hover, не как индикатор текущей
                страницы — Услуги/Задания не должны гореть цветом бренда постоянно
                после перехода. */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-semibold tracking-[0.01em] text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Правая часть: «Разместить» (для всех, от 768px), затем избранное
                и аватар — или «Войти» для гостя */}
            <div className="flex items-center gap-2 md:gap-4">
              <CreateListingMenu />
              {session ? (
                <>
                  <div className="hidden md:block h-6 w-px bg-border mx-1" />

                  {/* Избранное рядом с аватаром — решение владельца, 2026-09-17.
                      Отложить исполнителя и вернуться к нему — частое действие
                      при выборе, поэтому оно в шапке, а не в меню аватара.
                      Размер и фон при наведении — как у кнопки аватара, чтобы
                      пара читалась единым блоком; видно на любой ширине. */}
                  <div className="flex items-center gap-1">
                    <Link
                      href="/dashboard/favorites"
                      aria-label="Избранное"
                      title="Избранное"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent transition-colors"
                    >
                      <Heart aria-hidden="true" className="h-5 w-5" />
                    </Link>
                    <UserMenu session={session} />
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-base font-semibold text-foreground hover:text-primary transition-colors px-2"
                >
                  Войти
                </Link>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
