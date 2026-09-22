"use client";

import { Search, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateListingMenu } from "@/components/layout/CreateListingMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { useHeroVisibility, useSearchDraft } from "@/components/layout/search-context";
import { UserMenu } from "@/components/layout/UserMenu";
import { CityDropdown } from "@/components/shared/CityDropdown";
import { Logo } from "@/components/shared/Logo";
import { PageContainer } from "@/components/shared/PageContainer";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { CityOption } from "@/features/cities/queries";
import { SEARCH_QUERY_MAX_LENGTH } from "@/features/services/schemas";
import type { Session } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * `CloseWatcher` — API браузера для закрытия окон по «Назад» / Escape.
 * В типах TypeScript 5.9 его ещё нет; описана только используемая часть.
 */
type CloseWatcherConstructor = new () => {
  onclose: (() => void) | null;
  destroy(): void;
};

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

  // Видимость секции Hero приходит из контекста поиска, за ней следит SearchBar
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

  // Автозакрытия панели по видимости секции Hero нет (решение владельца,
  // 2026-09-19). Оно было нужно, пока человек мог сам докрутить до Hero
  // с открытой панелью. В режиме поиска прокрутка заблокирована, и Hero
  // оказывается на виду только из-за браузера — вернувшейся адресной строки
  // или клавиатуры на телефоне; автозакрытие срабатывало бы только ложно.
  // Панель закрывают крестик, Escape, «Назад», нажатие по затемнению,
  // «Найти» и смена адреса.
  //
  // Затемнение, блокировку прокрутки, Escape, нажатие мимо и удержание фокуса
  // даёт шторка `Sheet` из UI-кита (Radix Dialog) — см. разметку ниже. Здесь
  // только то, чего она сама не делает.
  useEffect(() => {
    if (!isMobileSearchOpen) return;

    // Кнопка и жест «Назад» на Android закрывают поиск, а не уводят со
    // страницы (решение владельца, 2026-09-19): так ведут себя открытые поверх
    // экрана окна. `CloseWatcher` — механизм браузера ровно для этого, тот же,
    // что у `<dialog>`: первое «Назад» достаётся ему, история браузера
    // не трогается. Есть в Chrome, Edge и Samsung Internet; в Safari и Firefox
    // его нет — там «Назад» уводит со страницы, как раньше.
    const BrowserCloseWatcher = (window as Window & { CloseWatcher?: CloseWatcherConstructor })
      .CloseWatcher;
    const closeWatcher = BrowserCloseWatcher ? new BrowserCloseWatcher() : null;
    if (closeWatcher) closeWatcher.onclose = () => setMobileSearchUrlKey(null);

    // С 1280px панели нет (xl:hidden), а затемнение и блокировка прокрутки
    // шторки остались бы — при расширении окна режим поиска закрывается.
    const desktop = window.matchMedia("(min-width: 1280px)");
    function handleDesktop(event: MediaQueryListEvent) {
      if (event.matches) setMobileSearchUrlKey(null);
    }
    desktop.addEventListener("change", handleDesktop);

    return () => {
      // Поиск закрыт любым способом — «Назад» снова уводит со страницы.
      closeWatcher?.destroy();
      desktop.removeEventListener("change", handleDesktop);
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
      {/* Режим поиска по лупе (ниже xl, решение владельца, 2026-09-19) —
          шторка `Sheet` из UI-кита со стороны top, как бургер-меню и фильтры.
          Она даёт затемнение (общее для сайта), блокировку прокрутки, Escape,
          закрытие нажатием по затемнению (оно дальше не проходит), удержание
          фокуса внутри и `aria-modal`. Фокус при открытии ставится в поле
          своим focus() — см. onOpenAutoFocus.

          Почему не своё: первая версия режима держала панель в «липкой» шапке
          и сама блокировала прокрутку `overflow: hidden` на <html>. Меню Radix
          (список городов) блокирует прокрутку своим замком на <body>; с двумя
          замками <body> становился отдельной прокручиваемой областью, и шапка
          с панелью уезжала за экран — оставалось одно затемнение. Ещё фокус
          в поле внутри липкой шапки сдвигал страницу под затемнением. Шторка
          живёт в отдельном слое, её замок — та же библиотека, что у меню
          (`react-remove-scroll`), и вложенные замки она согласует сама.

          Шторка всегда в разметке, а не под условием `showCompactSearch`:
          иначе исчезновение лупы (Hero выглянул из-за адресной строки
          браузера) закрывало бы поиск. При xl+ содержимого шторки не видно
          (xl:hidden), а режим закрывается эффектом выше. */}
      <Sheet
        open={isMobileSearchOpen}
        onOpenChange={(open) => setMobileSearchUrlKey(open ? urlKey : null)}
      >
        <SheetContent
          side="top"
          showCloseButton={false}
          // Курсор в поле — своим focus(), а не автофокусом шторки: Radix
          // фокусирует с preventScroll. На телефоне курсор в поле возвращает
          // спрятанную адресную строку браузера, она перекрывает верх шторки,
          // и с preventScroll браузер не может подвинуть видимую область —
          // поле оставалось под адресной строкой, видно было только выбор
          // города (сообщил владелец, 2026-09-19). Обычный focus() разрешает
          // браузеру показать поле; прокрутку страницы шторка держит своим
          // замком.
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            mobileSearchInputRef.current?.focus();
          }}
          aria-describedby={undefined}
          className="xl:hidden gap-0 border-border bg-hero-bg text-foreground shadow-none"
        >
          <SheetTitle className="sr-only">Поиск услуг</SheetTitle>
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
                  className="w-full h-10 pl-9 pr-3 text-sm bg-background border border-secondary/40 rounded-full text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-brand-heading/60 transition-colors"
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
              <SheetClose asChild>
                <button
                  type="button"
                  aria-label="Закрыть поиск"
                  className="relative tap-target shrink-0 text-foreground hover:text-primary transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
              {executorTypeField}
            </Form>
          </PageContainer>
        </SheetContent>
      </Sheet>

      <PageContainer>
        {/* Между зонами шапки — 16px, а от 1280px, где появляется поле поиска,
            32px (решение владельца, 2026-09-22): раньше зазоры между логотипом,
            разделами и полем были 16px, то есть **меньше**, чем расстояние между
            самими пунктами навигации, и три зоны сливались в сплошную строку.
            Правило: внутри группы отступ меньше, чем между группами. Поле —
            гибкое, поэтому добавленные зазоры оно отдаёт само: на 1280px его
            ширина падает с 444px до примерно 412px. */}
        <div className="flex h-16 lg:h-[72px] items-center">
          <div className="flex w-full items-center justify-between gap-4 xl:gap-8">
            {/* Левая часть: бургер (только на узких экранах) и логотип Sferus.
                Бургер слева от логотипа — решение владельца, 2026-09-17; меню
                выезжает с той же стороны (MobileMenu, side="left"). */}
            <div className="flex items-center gap-3">
              <MobileMenu />
              <Link
                href="/"
                className="relative tap-target flex items-center transition-opacity hover:opacity-90"
              >
                <Logo className="text-2xl" />
              </Link>
            </div>

            {/* Навигация идёт сразу за логотипом, перед поиском (решение
                владельца, 2026-09-22): «логотип → разделы → поиск → действия» —
                порядок Avito, Ozon, Wildberries, eBay и Amazon. Логотип
                и разделы читаются одним блоком «где я и куда пойти», а поиск
                встаёт в середину и растягивается до правой группы. До этого
                поиск стоял между логотипом и разделами и был ограничен 448px.

                Навигация (Inter, 14px, ховер перекрашивает в цвет бренда
                --primary). Цвет бренда только на hover, не как индикатор текущей
                страницы — Услуги/Задания не должны гореть цветом бренда постоянно
                после перехода. */}
            <nav className="hidden md:flex items-center gap-6">
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

                Sticky-поведение (только на главной): пока на экране видна секция Hero
                с собственным поиском, здесь этого блока нет — появляется
                плавно (opacity + max-width), когда секция Hero скрывается под
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
                  ? "opacity-100 max-w-3xl"
                  : "opacity-0 max-w-0 pointer-events-none",
              )}
            >
              <Form
                action="/services"
                className="flex w-full h-10 items-center relative bg-background border border-secondary/40 rounded-full transition-colors focus-within:border-brand-heading/60"
              >
                <label htmlFor="header-search" className="sr-only">
                  Поиск услуг
                </label>
                {/* Декоративной лупы слева нет (решение владельца, 2026-09-22):
                    отправка стала иконкой-лупой справа, и две одинаковые иконки
                    в одном поле путали бы — одна ничего не делает, вторая
                    отправляет. Так же устроены поля Amazon и Ozon. Освободившиеся
                    20px отступа достались тексту запроса. */}
                <input
                  id="header-search"
                  {...searchInputProps}
                  className="min-w-0 flex-1 h-full pl-4 pr-3 text-sm bg-transparent rounded-full text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
                />
                <div className="flex items-center shrink-0 pr-1">
                  <div aria-hidden="true" className="h-5 w-px bg-border mr-1" />
                  <CityDropdown
                    cities={cities}
                    value={draft.city}
                    onValueChange={selectCity}
                    variant="compact"
                  />
                  {/* Отправка — иконка, а не слово «Найти» (решение владельца,
                      2026-09-22): в компактном поле шапки кнопка с текстом
                      занимала около 72px, иконка — 32px, и эти 40px вместе
                      с отступом слева ушли в ширину запроса. В поиске первого
                      экрана и в шторке по лупе надпись остаётся: там есть место,
                      а слово понятнее иконки для тех, кто пришёл впервые.
                      Заливка бренда сохранена — это по-прежнему целевое действие
                      поля. `aria-label` и `title`: у кнопки без текста должно
                      быть имя и подсказка. */}
                  <button
                    type="submit"
                    aria-label="Найти"
                    title="Найти"
                    className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-fill text-brand-fill-foreground hover:bg-brand-fill/90 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Search aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
                {executorTypeField}
              </Form>
            </search>

            {/* Правая часть сгруппирована по типу (решения владельца,
                2026-09-22): сначала два элемента управления — поиск
                и «Разместить», затем черта, затем личный блок (колокольчик
                и аватар или «Войти» у гостя). Порядок внутри отвечает
                постоянной иерархии из PRODUCT.md: поиск, размещение, аккаунт. */}
            <div className="flex items-center gap-3">
              {/* Поиск до xl — кнопка с рамкой, а не голая иконка (решение
                  владельца, 2026-09-22): в ряду одинаковых иконок лупа терялась
                  и читалась как служебная, наравне с колокольчиком, хотя поиск
                  в иерархии первый. Рамка того же серого, что у поля поиска,
                  поэтому свёрнутый поиск и развёрнутое поле читаются как одно
                  и то же: с xl кнопка уступает место настоящему полю.
                  Жёлтая рамка занята действиями создания и сюда не подходит.

                  Сам блок стоит в правой части, рядом с аккаунтом: так её
                  ставят крупные маркетплейсы, и на телефоне она попадает
                  в зону большого пальца.

                  Показывается по тому же правилу, что компактная форма выше:
                  не главная страница, либо секция Hero уже скрылась при
                  скролле. Иначе на главной, пока виден поиск в Hero, кнопка
                  дублировала бы его. Никуда не ведёт — открывает режим поиска,
                  шторку с полным поиском (см. Sheet выше).

                  40px плюс `tap-target`: видимый размер кнопки меньше 44px,
                  зону касания добирает псевдоэлемент. */}
              {showCompactSearch && (
                <button
                  type="button"
                  aria-label="Найти услугу"
                  aria-expanded={isMobileSearchOpen}
                  onClick={() => setMobileSearchUrlKey(urlKey)}
                  className="relative tap-target xl:hidden flex size-10 items-center justify-center rounded-full border border-secondary/40 text-foreground hover:bg-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              <CreateListingMenu />

              {/* Черта отделяет элементы управления от личного блока и стоит
                  в обоих состояниях (решение владельца, 2026-09-22): раньше
                  она была только у вошедшего, и при входе правая часть
                  перестраивалась не только составом, но и разметкой. */}
              <div aria-hidden="true" className="hidden md:block h-6 w-px bg-border" />

              {/* Сердечка «Избранное» здесь больше нет (решение владельца,
                  2026-09-21): раздел есть в меню под аватаром, и двух входов
                  в одно место не нужно. С 2026-09-17 по 2026-09-21 сердечко
                  стояло в шапке по обратному решению — «отложить исполнителя
                  и вернуться к нему» считалось достаточно частым действием,
                  чтобы держать его на виду. */}
              {session ? (
                <div className="flex items-center gap-1">
                  <NotificationsMenu />
                  <UserMenu session={session} />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="relative tap-target flex h-10 items-center rounded-full px-3 text-base font-semibold text-foreground hover:bg-accent hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
