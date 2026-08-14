import { z } from "zod";
import { profileType } from "@/lib/db/schema";

/**
 * Схемы валидации услуги.
 *
 * Схемы пишутся руками и по сценарию, а не генерируются из таблицы: вход формы
 * структурно не совпадает со строкой БД. Здесь это видно на «Договорной» —
 * в форме это флаг, а в таблице отсутствие значения в колонке цены.
 *
 * FormData отдаёт только строки, поэтому числа приводятся через `z.coerce`.
 */

/** Единицы измерения цены. Совпадают с pg-enum `price_unit`. */
export const PRICE_UNITS = ["hour", "job", "day", "sqm", "unit"] as const;

export const PRICE_UNIT_LABELS: Record<(typeof PRICE_UNITS)[number], string> = {
  hour: "за час",
  job: "за работу",
  day: "за день",
  sqm: "за кв.м.",
  unit: "за единицу",
};

/** Подписи типа исполнителя для фильтра каталога. Значения — enum `profile_type`. */
export const EXECUTOR_TYPE_LABELS: Record<(typeof profileType.enumValues)[number], string> = {
  individual: "Частный специалист",
  company: "Компания",
};

/**
 * Невыбранный чекбокс в FormData отсутствует вовсе, выбранный приходит как "on".
 *
 * Два подводных камня, на обоих можно ошибиться:
 *
 * 1. `z.coerce.boolean()` не годится — он превращает в `true` любую непустую
 *    строку, включая "false".
 * 2. `.optional()` обязателен. Включение `z.undefined()` в union НЕ делает ключ
 *    необязательным: в zod 4 отсутствующий ключ падает с «expected nonoptional».
 */
const checkboxField = z
  .union([z.literal("on"), z.literal("true")])
  .optional()
  .transform((value) => value !== undefined);

/** Скрытое поле с явным "true" / "false" — для переключателей, не являющихся чекбоксом. */
const booleanField = z.enum(["true", "false"]).transform((value) => value === "true");

/** Ссылка на строку справочника. */
const referenceId = z.coerce
  .number({ error: "Выберите значение из списка" })
  .int()
  .positive("Выберите значение из списка");

const serviceFields = {
  title: z
    .string()
    .trim()
    .min(10, "Заголовок слишком короткий — минимум 10 символов")
    .max(100, "Заголовок не длиннее 100 символов"),

  description: z
    .string()
    .trim()
    .min(20, "Опишите услугу подробнее — минимум 20 символов")
    .max(5000, "Описание не длиннее 5000 символов"),

  // Пустая строка означает «цена не указана»: колонка nullable, а ограничение
  // «цена или договорная» проверяется ниже целиком по объекту.
  price: z
    .union([z.literal(""), z.coerce.number().int().positive("Цена должна быть больше нуля")])
    .transform((value) => (value === "" ? null : value))
    .refine((value) => value === null || value <= 2_147_483_647, "Слишком большое значение"),

  isNegotiable: checkboxField,
  priceUnit: z.enum(PRICE_UNITS),
  categoryId: referenceId,
  cityId: referenceId,
  homeVisit: booleanField,
};

/**
 * Ограничение уровня БД: `CHECK (price IS NOT NULL OR is_negotiable)`.
 * Дублируется здесь, чтобы пользователь увидел понятное сообщение под полем,
 * а не ошибку драйвера.
 */
const priceOrNegotiable = {
  check: (data: { price: number | null; isNegotiable: boolean }) =>
    data.isNegotiable || data.price !== null,
  message: "Укажите цену или отметьте «Договорная»",
  path: ["price"] as const,
};

export const createServiceSchema = z.object(serviceFields).refine(priceOrNegotiable.check, {
  message: priceOrNegotiable.message,
  path: [...priceOrNegotiable.path],
});

export const updateServiceSchema = z
  .object({
    ...serviceFields,
    id: z.coerce.number().int().positive(),
  })
  .refine(priceOrNegotiable.check, {
    message: priceOrNegotiable.message,
    path: [...priceOrNegotiable.path],
  });

/** Смена видимости объявления владельцем. */
export const toggleServiceSchema = z.object({
  id: z.coerce.number().int().positive(),
  isActive: booleanField,
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

/**
 * Фильтры каталога — вход из query-строки страницы, а не из формы, но то же
 * правило применимо: значение подставляет пользователь через адресную строку,
 * и его нельзя передавать в запрос как есть.
 *
 * `executorType` — enum на уровне БД (`profiles.type`): невалидное значение
 * не просто некрасиво отфильтрует, а уронит запрос ошибкой Postgres
 * «invalid input value for enum». Поэтому проверяется через `z.enum` и тихо
 * игнорируется при несовпадении — вернуться к «все исполнители» безопаснее,
 * чем показать пользователю 500.
 *
 * `cityName` не enum и ни на что не завязан: неизвестное имя города просто
 * не найдёт совпадений в `WHERE`, отдельная проверка не нужна.
 */
const executorTypeParam = z.enum(profileType.enumValues);

function firstSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export interface ServiceCatalogFilters {
  cityName?: string;
  executorType?: (typeof profileType.enumValues)[number];
}

export function parseServiceCatalogFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ServiceCatalogFilters {
  const cityName = firstSearchParamValue(searchParams.city)?.trim();
  const executorType = executorTypeParam.safeParse(firstSearchParamValue(searchParams.type));

  return {
    cityName: cityName || undefined,
    executorType: executorType.success ? executorType.data : undefined,
  };
}
