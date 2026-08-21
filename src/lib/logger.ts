/**
 * Логирование ошибок одной строкой JSON.
 *
 * Не `console.error("[что-то]", error)`: такую строку невозможно найти. Логи
 * Vercel умеют искать по полям JSON, а по свободному тексту — нет, поэтому
 * формат один на весь проект и машиночитаемый.
 *
 * Одна строка на событие принципиально: многострочный вывод в облачных логах
 * разъезжается на отдельные записи, и стек теряет связь с сообщением.
 * `JSON.stringify` экранирует переводы строк внутри стека, и запись остаётся целой.
 *
 * Модуль **не помечен** `server-only` намеренно: его использует
 * `src/instrumentation.ts`, который выполняется вне контекста серверного
 * компонента, и `server-only` там бы упал.
 */

type LogContext = Record<string, unknown>;

interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  /**
   * Хеш, который Next показывает пользователю на странице ошибки.
   * Единственное, что связывает жалобу «у меня всё сломалось» с этой записью.
   */
  digest?: string;
}

/**
 * Бросить в JavaScript можно что угодно, не только `Error`.
 * Строка, объект и `undefined` тоже должны попасть в лог, а не потеряться.
 */
function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    const digest = (error as Error & { digest?: unknown }).digest;

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      digest: typeof digest === "string" ? digest : undefined,
    };
  }

  return {
    name: typeof error,
    message: typeof error === "string" ? error : (JSON.stringify(error) ?? String(error)),
  };
}

/**
 * Записать ошибку.
 *
 * `scope` — откуда она пришла: `request`, `action`, `storage`. По нему потом
 * фильтруют логи.
 *
 * **В `context` не должно попадать ничего личного:** заголовки запроса (там
 * cookie сессии), содержимое форм, контакты, адреса почты. В лог кладут то,
 * по чему ошибку ищут, — маршрут, идентификатор объекта, тип операции.
 */
export function logError(scope: string, error: unknown, context?: LogContext): void {
  const entry = {
    level: "error",
    scope,
    time: new Date().toISOString(),
    ...serializeError(error),
    ...context,
  };

  console.error(JSON.stringify(entry));
}
