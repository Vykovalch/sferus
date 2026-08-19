import { z } from "zod";

/**
 * Схемы избранного.
 *
 * Услуги и задания лежат в одной таблице с двумя nullable-ссылками, поэтому
 * и на входе они различаются дискриминантом, а не отдельными действиями —
 * тот же приём, что у раскрытия контактов.
 */

export const FAVORITE_KINDS = ["service", "task"] as const;

export type FavoriteKind = (typeof FAVORITE_KINDS)[number];

export const FAVORITE_KIND_LABELS: Record<FavoriteKind, string> = {
  service: "Услуги",
  task: "Задания",
};

/**
 * Переключение отметки. Отдельных «добавить» и «убрать» нет: кнопка одна,
 * а состояние определяется наличием строки — два действия означали бы, что
 * клиент сообщает серверу то, что сервер и так знает лучше.
 */
export const toggleFavoriteSchema = z.object({
  kind: z.enum(FAVORITE_KINDS, { error: "Неизвестный тип объявления" }),
  id: z.coerce.number({ error: "Некорректное объявление" }).int().positive(),
});

export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;

/**
 * Фильтр раздела «Избранное» — вход из query-строки. Значение подставляет
 * пользователь через адресную строку, поэтому проверяется так же, как фильтры
 * каталогов: невалидное тихо откатывается к «все», а не роняет страницу.
 *
 * В отличие от статуса заданий, у типа есть законное состояние «все» —
 * раздел по умолчанию показывает и услуги, и задания вперемешку.
 */
export interface FavoritesFilter {
  kind?: FavoriteKind;
}

const kindParam = z.enum(FAVORITE_KINDS);

function firstSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseFavoritesFilter(
  searchParams: Record<string, string | string[] | undefined>,
): FavoritesFilter {
  const kind = kindParam.safeParse(firstSearchParamValue(searchParams.type));

  return { kind: kind.success ? kind.data : undefined };
}
