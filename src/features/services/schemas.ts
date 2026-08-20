import { z } from "zod";
import { profileType } from "@/lib/db/schema";
import { IMAGE_UPLOAD, isUploadedImageUrl } from "@/lib/images";

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

/**
 * Адреса загруженных фотографий.
 *
 * Одно имя поля повторяется в форме столько раз, сколько фотографий: разбор
 * `FormData` отдаёт строку при одном вхождении, массив при нескольких
 * и `undefined`, когда фото нет вовсе, — схема обязана принять все три случая.
 *
 * Принадлежность адреса нашему хранилищу проверяется обязательно: значения
 * приходят из формы, то есть их подставляет пользователь. Без проверки
 * в объявление можно было бы вписать картинку с чужого домена — вплоть до
 * отслеживающего пикселя, который собирал бы адреса всех, кто открыл каталог.
 */
const imageUrlsField = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (value === undefined) return [];
    return (Array.isArray(value) ? value : [value]).filter((url) => url.length > 0);
  })
  .pipe(
    z
      .array(z.string().refine(isUploadedImageUrl, "Недопустимый адрес изображения"))
      .max(IMAGE_UPLOAD.maxFiles, `Не больше ${IMAGE_UPLOAD.maxFiles} фотографий`),
  );

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
  imageUrls: imageUrlsField,
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
  /** Текстовый запрос. Пустой и слишком длинный отбрасываются. */
  query?: string;
}

/**
 * Ограничение длины поискового запроса.
 *
 * Не из вредности: `websearch_to_tsquery` разбирает строку целиком, и очень
 * длинный ввод — это лишняя работа на каждый запрос. Сто символов с запасом
 * покрывают любую осмысленную фразу.
 */
export const SEARCH_QUERY_MAX_LENGTH = 100;

export function parseServiceCatalogFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ServiceCatalogFilters {
  const cityName = firstSearchParamValue(searchParams.city)?.trim();
  const executorType = executorTypeParam.safeParse(firstSearchParamValue(searchParams.type));
  const query = firstSearchParamValue(searchParams.q)?.trim().slice(0, SEARCH_QUERY_MAX_LENGTH);

  return {
    cityName: cityName || undefined,
    executorType: executorType.success ? executorType.data : undefined,
    query: query || undefined,
  };
}
