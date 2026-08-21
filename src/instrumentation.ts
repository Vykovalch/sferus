import type { Instrumentation } from "next";
import { logError } from "@/lib/logger";

/**
 * Сбор серверных ошибок в одной точке.
 *
 * `onRequestError` — штатный механизм Next: он срабатывает на ошибках рендера,
 * обработчиков маршрутов, **Server Actions** и proxy. Отдельная обвязка вокруг
 * каждого из них не нужна и разъехалась бы.
 *
 * Главное здесь — `digest`. Пользователю Next специально не показывает текст
 * серверной ошибки (чтобы наружу не утекли подробности) и оставляет вместо него
 * хеш. Тот же хеш попадает в эту запись, и по нему жалоба «у меня всё сломалось,
 * код 3141592653» превращается в конкретную строку лога.
 *
 * Внешнего трекера нет по решению владельца: пишем в stdout, логи собирает
 * Vercel. Если трекер появится, он подключается здесь одним вызовом — остальной
 * код трогать не придётся.
 */
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  logError("request", error, {
    path: request.path,
    method: request.method,
    // Файл маршрута (`/services/[slug]`), а не подставленный адрес: по нему
    // группируются ошибки одной страницы с разными параметрами.
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
  });

  // `request.headers` сюда не попадает намеренно: там cookie сессии.
  // Лог — это то, что читают в отладке, и складывать в него ключи от аккаунтов
  // нельзя даже временно.
};
