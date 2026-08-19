import { z } from "zod";
import type { contactChannel } from "@/lib/db/schema";
import { profileType } from "@/lib/db/schema";

/**
 * Схемы контактных каналов профиля.
 *
 * Вход формы структурно не совпадает со строками таблицы, и здесь это видно
 * особенно ярко: пользователь вводит **один** номер телефона, а в
 * `profile_contacts` он превращается в три строки — звонки, WhatsApp и Viber.
 * Так устроено потому, что мессенджеры работают по тому же номеру, а
 * раскрытие контактов уже умеет строить ссылку для каждого канала отдельно.
 *
 * FormData отдаёт только строки, поэтому чекбоксы разбираются тем же
 * `checkboxField`, что в услугах и заданиях.
 */

/** Каналы связи. Значения совпадают с pg-enum `contact_channel`. */
export type ContactChannel = (typeof contactChannel.enumValues)[number];

/**
 * Невыбранный чекбокс в FormData отсутствует вовсе, выбранный приходит как "on".
 *
 * `.optional()` обязателен: в zod 4 включение `z.undefined()` в union НЕ делает
 * ключ необязательным. Тот же приём, что в `features/services/schemas.ts` —
 * ошибка этого класса уже ломала форму услуги на этапе 1.1.
 */
const checkboxField = z
  .union([z.literal("on"), z.literal("true")])
  .optional()
  .transform((value) => value !== undefined);

/** Мягкая проверка: `+`, цифры, пробелы, скобки и дефисы. */
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

/** Имя пользователя Telegram, с ведущей «@» или без неё. */
const TELEGRAM_PATTERN = /^@?[a-zA-Z0-9_]{5,32}$/;

/**
 * Значение контакта. Пустая строка допустима и означает «канал не заполнен» —
 * действие в этом случае удалит строку, а не запишет пустое значение в колонку
 * `NOT NULL`.
 *
 * Ключ может отсутствовать целиком: действие — публичный эндпоинт, и прямой
 * POST без части полей должен дать обычный результат, а не ошибку типа.
 */
function contactValue(pattern: RegExp, message: string) {
  return z
    .string()
    .trim()
    .max(64, "Слишком длинное значение")
    .refine((value) => value === "" || pattern.test(value), message)
    .optional()
    .transform((value) => value ?? "");
}

/**
 * Галочки — это видимость канала, а не его наличие: снятая галочка прячет
 * контакт, но сохраняет значение. Ради этого контакты и вынесены в отдельную
 * таблицу с колонкой `is_visible` (см. docs/DATA-MODEL.md).
 *
 * Галочки при пустом телефоне ошибкой не считаются: они описывают, как
 * связаться по номеру, и без номера просто ни о чём.
 */
export const updateContactsSchema = z.object({
  phone: contactValue(PHONE_PATTERN, "Введите номер телефона, например +373 777 12345"),
  phoneVisible: checkboxField,
  whatsappVisible: checkboxField,
  viberVisible: checkboxField,
  telegram: contactValue(
    TELEGRAM_PATTERN,
    "Введите имя пользователя Telegram, например @ivan_petrov",
  ),
  telegramVisible: checkboxField,
});

export type UpdateContactsInput = z.infer<typeof updateContactsSchema>;

export interface ContactRow {
  channel: ContactChannel;
  value: string;
  isVisible: boolean;
}

/**
 * Вход формы → строки `profile_contacts`.
 *
 * Каналы, которых здесь нет, действие удаляет: форма является полным
 * состоянием контактов профиля, а не частичным патчем.
 */
export function toContactRows(input: UpdateContactsInput): ContactRow[] {
  const rows: ContactRow[] = [];

  if (input.phone) {
    rows.push({ channel: "phone", value: input.phone, isVisible: input.phoneVisible });
    rows.push({ channel: "whatsapp", value: input.phone, isVisible: input.whatsappVisible });
    rows.push({ channel: "viber", value: input.phone, isVisible: input.viberVisible });
  }

  if (input.telegram) {
    rows.push({ channel: "telegram", value: input.telegram, isVisible: input.telegramVisible });
  }

  return rows;
}

/** Значения формы настройки контактов. */
export interface ContactFormValues {
  phone: string;
  phoneVisible: boolean;
  whatsappVisible: boolean;
  viberVisible: boolean;
  telegram: string;
  telegramVisible: boolean;
}

/**
 * Строки `profile_contacts` → значения формы.
 *
 * Обратное преобразование к `toContactRows`. Пустой профиль получает все
 * галочки включёнными: скрывать контакт — осознанное действие, а не значение
 * по умолчанию, иначе введённый номер молча никому не покажется.
 */
export function toContactFormValues(rows: ContactRow[]): ContactFormValues {
  const byChannel = new Map(rows.map((row) => [row.channel, row]));

  // Номер один на три канала, но если строка звонков почему-то отсутствует,
  // значение всё равно нужно достать — иначе форма покажет пустое поле
  // и следующее сохранение сотрёт мессенджеры.
  const phone = byChannel.get("phone") ?? byChannel.get("whatsapp") ?? byChannel.get("viber");
  const telegram = byChannel.get("telegram");

  return {
    phone: phone?.value ?? "",
    phoneVisible: byChannel.get("phone")?.isVisible ?? true,
    whatsappVisible: byChannel.get("whatsapp")?.isVisible ?? true,
    viberVisible: byChannel.get("viber")?.isVisible ?? true,
    telegram: telegram?.value ?? "",
    telegramVisible: telegram?.isVisible ?? true,
  };
}

/* ────────────────────────── профиль ────────────────────────── */

/**
 * Подписи правовой формы. Значения — pg-enum `profile_type`, тот же список,
 * что у фильтра «Исполнитель» в каталоге услуг.
 */
export const PROFILE_TYPE_LABELS: Record<(typeof profileType.enumValues)[number], string> = {
  individual: "Частное лицо",
  company: "Компания",
};

/**
 * Необязательное поле-число: пустая строка означает «не указано» и уходит
 * в колонку как `null`. Ключ может отсутствовать целиком — действие является
 * публичным эндпоинтом.
 *
 * `.optional()` стоит на union, а не внутри: `z.coerce.number()` превратил бы
 * `undefined` в `NaN` и дал невнятную ошибку вместо пустого значения.
 */
function optionalNumber(inner: z.ZodType<number>) {
  return z
    .union([z.literal(""), inner])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value));
}

/**
 * Схема формы профиля.
 *
 * Имя лежит в таблице `user` (территория better-auth), остальное — в `profiles`,
 * поэтому действие пишет в два места. Email в схему не входит вовсе: его смена —
 * отдельный сценарий better-auth с подтверждением по почте, и присланное прямым
 * POST значение здесь просто отбрасывается.
 *
 * `username` тоже не редактируется — он адрес публичной страницы, см. DATA-MODEL.md.
 */
export const updateProfileSchema = z.object({
  name: z
    .string({ error: "Укажите имя" })
    .trim()
    .min(2, "Имя слишком короткое — минимум 2 символа")
    .max(100, "Имя не длиннее 100 символов"),

  // enum на уровне БД: непроверенное значение уронило бы запрос ошибкой
  // Postgres «invalid input value for enum», а не просто сохранило мусор.
  type: z.enum(profileType.enumValues, { error: "Выберите тип профиля" }),

  cityId: optionalNumber(z.coerce.number({ error: "Выберите город из списка" }).int().positive()),

  experienceYears: optionalNumber(
    z.coerce
      .number({ error: "Опыт работы указывается числом лет" })
      .int("Опыт работы указывается целым числом лет")
      .min(0, "Опыт работы не может быть отрицательным")
      .max(80, "Проверьте опыт работы — не больше 80 лет"),
  ),

  bio: z
    .string()
    .trim()
    .max(1000, "Описание не длиннее 1000 символов")
    .optional()
    .transform((value) => (value ? value : null)),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
