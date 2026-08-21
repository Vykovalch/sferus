import { PRICE_UNIT_LABELS, type PRICE_UNITS } from "@/features/services/schemas";

type PriceUnit = (typeof PRICE_UNITS)[number];

/**
 * Цена услуги для показа: «от 80 руб. за час» либо «Договорная».
 *
 * В БД «Договорная» — это отсутствие значения в колонке цены плюс флаг,
 * поэтому склеивание строки живёт здесь, а не в компонентах.
 */
export function formatServicePrice(
  price: number | null,
  isNegotiable: boolean,
  priceUnit: string,
): string {
  if (isNegotiable || price === null) return "Договорная";

  const unit = PRICE_UNIT_LABELS[priceUnit as PriceUnit];
  return unit ? `от ${price} руб. ${unit}` : `от ${price} руб.`;
}

/** Бюджет задания: «до 500 руб.» либо «Договорной». */
export function formatTaskBudget(budget: number | null, isNegotiable: boolean): string {
  if (isNegotiable || budget === null) return "Договорной";
  return `до ${budget} руб.`;
}

const RELATIVE_UNITS: [limitSeconds: number, divisor: number, unit: Intl.RelativeTimeFormatUnit][] =
  [
    [60, 1, "second"],
    [3600, 60, "minute"],
    [86400, 3600, "hour"],
    [2592000, 86400, "day"],
    [31536000, 2592000, "month"],
    [Number.POSITIVE_INFINITY, 31536000, "year"],
  ];

const relative = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });

/** «2 часа назад», «вчера». Склонения берёт Intl, руками их писать не нужно. */
export function formatRelativeDate(date: Date): string {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absolute = Math.abs(seconds);

  for (const [limit, divisor, unit] of RELATIVE_UNITS) {
    if (absolute < limit) return relative.format(Math.round(seconds / divisor), unit);
  }

  return relative.format(Math.round(seconds / 31536000), "year");
}

/**
 * День здесь не нужен и в результат не попадёт — он добавлен ради падежа.
 *
 * Без `day` в опциях `Intl` отдаёт месяц в именительном падеже («июнь 2026 г.»),
 * потому что считает его самостоятельной подписью. В строке «На платформе
 * с …» нужен родительный, а он появляется только когда месяц стоит внутри
 * полной даты.
 */
const dayMonthYear = new Intl.DateTimeFormat("ru", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** «июня 2026 г.» — для строки «На платформе с …». */
export function formatMonthYear(date: Date): string {
  const parts = dayMonthYear.formatToParts(date);
  const monthIndex = parts.findIndex((part) => part.type === "month");

  // Отбрасываем всё до месяца — и сам день, и разделитель после него.
  // Хвост («2026 г.») склеивается как есть, вместе с разделителями локали.
  return parts
    .slice(monthIndex)
    .map((part) => part.value)
    .join("");
}

const plural = new Intl.PluralRules("ru");

const YEAR_FORMS: Record<Intl.LDMLPluralRule, string> = {
  one: "год",
  few: "года",
  many: "лет",
  other: "лет",
  zero: "лет",
  two: "лет",
};

/**
 * «1 год», «3 года», «10 лет».
 *
 * Склонение берёт `Intl`, как и относительные даты выше: руками правила для
 * русского не пишем. До этапа 2 опыт работы негде было указать, поэтому «1 лет»
 * никто не видел — с появлением формы профиля стало видно сразу.
 */
export function formatYears(value: number): string {
  return `${value} ${YEAR_FORMS[plural.select(value)]}`;
}

const shortDate = new Intl.DateTimeFormat("ru", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** «12 янв. 2026» — точная дата там, где она важна: списки админки. */
export function formatShortDate(date: Date): string {
  return shortDate.format(date);
}
