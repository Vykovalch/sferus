import { z } from "zod";
import { taskStatus } from "@/lib/db/schema";

/**
 * Схемы валидации задания.
 *
 * Повторяет паттерн `features/services/schemas.ts`: вход формы — строки из
 * FormData, числа приводятся через `z.coerce`. «Договорная» — тот же случай,
 * что и у цены услуги: флаг в форме, `null` в колонке бюджета.
 */

const checkboxField = z
  .union([z.literal("on"), z.literal("true")])
  .optional()
  .transform((value) => value !== undefined);

const referenceId = z.coerce
  .number({ error: "Выберите значение из списка" })
  .int()
  .positive("Выберите значение из списка");

const taskFields = {
  title: z
    .string()
    .trim()
    .min(10, "Заголовок слишком короткий — минимум 10 символов")
    .max(100, "Заголовок не длиннее 100 символов"),

  description: z
    .string()
    .trim()
    .min(20, "Опишите задание подробнее — минимум 20 символов")
    .max(5000, "Описание не длиннее 5000 символов"),

  budget: z
    .union([z.literal(""), z.coerce.number().int().positive("Бюджет должен быть больше нуля")])
    .transform((value) => (value === "" ? null : value))
    .refine((value) => value === null || value <= 2_147_483_647, "Слишком большое значение"),

  isNegotiable: checkboxField,
  categoryId: referenceId,
  cityId: referenceId,
};

const budgetOrNegotiable = {
  check: (data: { budget: number | null; isNegotiable: boolean }) =>
    data.isNegotiable || data.budget !== null,
  message: "Укажите бюджет или отметьте «Договорная»",
  path: ["budget"] as const,
};

export const createTaskSchema = z.object(taskFields).refine(budgetOrNegotiable.check, {
  message: budgetOrNegotiable.message,
  path: [...budgetOrNegotiable.path],
});

export const updateTaskSchema = z
  .object({
    ...taskFields,
    id: z.coerce.number().int().positive(),
  })
  .refine(budgetOrNegotiable.check, {
    message: budgetOrNegotiable.message,
    path: [...budgetOrNegotiable.path],
  });

/** Смена статуса задания владельцем: закрыть как выполненное или отменить. */
export const changeTaskStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(["completed", "cancelled"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * Фильтры каталога заданий — вход из query-строки, тот же принцип, что у
 * `features/services/schemas.ts#parseServiceCatalogFilters`. `status` — enum
 * на уровне БД, невалидное значение должно тихо откатиться к дефолту, а не
 * уронить запрос ошибкой Postgres.
 *
 * У статуса, в отличие от города и категории, нет состояния «все»: доска
 * заданий по умолчанию показывает открытые, а не историю целиком.
 */
const taskStatusParam = z.enum(taskStatus.enumValues);

function firstSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export interface TaskCatalogFilters {
  categorySlug?: string;
  cityName?: string;
  status: (typeof taskStatus.enumValues)[number];
}

export function parseTaskCatalogFilters(
  searchParams: Record<string, string | string[] | undefined>,
): TaskCatalogFilters {
  const categorySlug = firstSearchParamValue(searchParams.category)?.trim();
  const cityName = firstSearchParamValue(searchParams.city)?.trim();
  const status = taskStatusParam.safeParse(firstSearchParamValue(searchParams.status));

  return {
    categorySlug: categorySlug || undefined,
    cityName: cityName || undefined,
    status: status.success ? status.data : "open",
  };
}

/**
 * Фильтры доски обратно в параметры адреса — обратная сторона разбора выше.
 *
 * Одно место на сайдбар и пагинацию, чтобы наборы параметров не разъехались:
 * у услуг такое расхождение уже случалось и стоило потерянного `q`.
 *
 * `status=open` в адрес не пишется — это значение по умолчанию, и лишний
 * параметр только плодил бы разные адреса для одного и того же списка.
 * Номер страницы сюда не входит: смена фильтра возвращает на первую.
 */
export function taskCatalogSearchParams(filters: TaskCatalogFilters): URLSearchParams {
  const search = new URLSearchParams();

  if (filters.categorySlug) search.set("category", filters.categorySlug);
  if (filters.cityName) search.set("city", filters.cityName);
  if (filters.status !== "open") search.set("status", filters.status);

  return search;
}
