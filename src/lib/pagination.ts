/**
 * Постраничная выборка списков.
 *
 * Общий модуль, а не по копии в каждой фиче: каталог услуг, поиск и доска
 * заданий режутся на страницы одинаково, и правило «первая страница живёт
 * без параметра» должно быть записано ровно один раз.
 *
 * Выбран `LIMIT/OFFSET`, а не курсор: каталогу нужны номера страниц и переход
 * на произвольную страницу, а курсор не даёт ни того, ни другого и не
 * индексируется. Смещение начинает деградировать на десятках тысяч строк —
 * до этого объёма ещё далеко, а когда он появится, менять придётся только
 * этот модуль и запросы, но не страницы.
 */

/** Карточек на странице. Двадцать делится на 2, 4 и 5 — сетка не оставляет рваный низ. */
export const PAGE_SIZE = 20;

/**
 * Номер страницы из адресной строки.
 *
 * Всё, что не является натуральным числом, — это первая страница, а не ошибка:
 * `?page=` правит рукой кто угодно, и падать на `?page=abc` странице каталога
 * незачем. Отрицательные, ноль, дробные и мусор сводятся к единице.
 */
export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return 1;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;

  return parsed;
}

/** Сколько строк пропустить, чтобы получить нужную страницу. */
export function offsetFor(page: number, pageSize: number = PAGE_SIZE): number {
  return (page - 1) * pageSize;
}

/**
 * Число страниц.
 *
 * Пустой список — это одна страница, а не ноль: страница каталога без
 * объявлений существует и показывает пустое состояние. Ноль означал бы,
 * что первая страница вне диапазона, и она отдавала бы 404.
 */
export function pageCount(total: number, pageSize: number = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/**
 * Страница за пределом диапазона.
 *
 * Такие адреса отдают 404, а не пустую сетку: иначе у поискового робота
 * появляется бесконечное пространство пустых страниц, каждая со своим URL.
 */
export function isPageOutOfRange(page: number, total: number, pageSize: number = PAGE_SIZE) {
  return page > pageCount(total, pageSize);
}

/**
 * Адрес страницы списка.
 *
 * Первая страница **без параметра**: `/services/remont` и
 * `/services/remont?page=1` — один и тот же список, и два адреса на одно
 * содержимое поисковик считает дублем.
 *
 * Исходные параметры не изменяются — копия, потому что один и тот же набор
 * фильтров используется для всех ссылок пагинации сразу.
 */
export function buildPageHref(basePath: string, params: URLSearchParams, page: number): string {
  const next = new URLSearchParams(params);

  if (page <= 1) next.delete("page");
  else next.set("page", String(page));

  const query = next.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Пропуск в ряду номеров страниц. */
export type PageGap = "gap";
export type PageItem = number | PageGap;

/**
 * Ряд номеров для разметки: первая, последняя, текущая и её соседи.
 *
 * Пропуск в одну страницу не сворачивается: ряд «1 … 3» занимает столько же
 * места, сколько «1 2 3», но прячет страницу, на которую человек мог хотеть
 * перейти. Многоточие появляется, только когда за ним скрыто больше одной.
 */
export function pageWindow(page: number, total: number): PageItem[] {
  const shown = [1, total, page - 1, page, page + 1]
    .filter((value) => value >= 1 && value <= total)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  let previous = 0;

  for (const value of shown) {
    if (value === previous) continue;

    const missing = value - previous - 1;
    if (previous !== 0 && missing > 0) items.push(missing === 1 ? previous + 1 : "gap");

    items.push(value);
    previous = value;
  }

  return items;
}
