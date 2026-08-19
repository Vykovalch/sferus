import { z } from "zod";
import type { moderationStatus } from "@/lib/db/schema";

/**
 * Схемы админских действий.
 *
 * Значения, которыми оперирует администратор, — подмножество pg-enum
 * `moderation_status`: `pending` и `rejected` заведены заделом под премодерацию
 * и в v1 не используются (DATA-MODEL.md). Схема сужена до двух намеренно:
 * так прямой POST не сможет перевести объявление в состояние, которого
 * интерфейс не показывает и которое запросы каталога не ожидают.
 */

type ModerationStatus = (typeof moderationStatus.enumValues)[number];

export const ADMIN_MODERATION_STATUSES = [
  "approved",
  "blocked",
] as const satisfies readonly ModerationStatus[];

const listingId = z.coerce.number({ error: "Некорректное объявление" }).int().positive();

/** Скрыть объявление или вернуть его в каталог. Обратимое действие. */
export const setModerationSchema = z.object({
  id: listingId,
  status: z.enum(ADMIN_MODERATION_STATUSES, { error: "Недопустимое состояние модерации" }),
});

/**
 * Физическое удаление. Необратимо и вычищает объявление из чужого избранного
 * каскадом — предназначено для спама и противоправного контента, а не для
 * временного скрытия (DATA-MODEL.md, «Недоступные объявления в избранном»).
 */
export const deleteListingSchema = z.object({
  id: listingId,
});

/**
 * Блокировка пользователя.
 *
 * `userId` строковый: идентификаторы better-auth — это текст, а не bigint
 * доменных таблиц. Состояние приходит явным «true»/«false», а не отсутствием
 * чекбокса: кнопка одна, и она должна одинаково уметь блокировать
 * и разблокировать.
 */
export const setUserBanSchema = z.object({
  userId: z.string().trim().min(1, "Некорректный пользователь"),
  banned: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export type SetModerationInput = z.infer<typeof setModerationSchema>;
export type DeleteListingInput = z.infer<typeof deleteListingSchema>;
export type SetUserBanInput = z.infer<typeof setUserBanSchema>;
