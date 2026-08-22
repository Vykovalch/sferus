/**
 * Идентичность сайта для метаданных, карты сайта и robots.
 *
 * Адрес берётся из `NEXT_PUBLIC_APP_URL` — той же переменной, на которой уже
 * работают better-auth и ссылки в письмах. Второй источник правды завёл бы
 * ситуацию, когда письма ведут на один адрес, а карта сайта отдаёт другой.
 *
 * **Важно для деплоя:** локально там `http://localhost:3000`, и это правильно.
 * Но на продакшене переменная обязана быть боевым адресом — иначе карта сайта
 * и канонические ссылки укажут на localhost, и в индекс не попадёт ничего.
 */

export const SITE_NAME = "Sferus";

const FALLBACK_URL = "http://localhost:3000";

/**
 * Канонический адрес без завершающего слэша.
 *
 * Слэш убирается, потому что адреса собираются склейкой (`${SITE_URL}${path}`),
 * и `https://sferus.net//services` — это другой URL для поискового робота.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || FALLBACK_URL).replace(/\/+$/, "");

/** Полный адрес страницы из пути. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Длина описания в выдаче.
 *
 * Гугл обрезает примерно на этом месте, и обрезанное на полуслове описание
 * выглядит хуже, чем законченное короткое.
 */
export const META_DESCRIPTION_MAX = 160;

/**
 * Текст пользователя → описание для поисковика и превью ссылки.
 *
 * Описания объявлений пишут люди: там переводы строк, двойные пробелы и любая
 * длина. В `<meta>` это должно приехать одной строкой и обрезанным по границе
 * слова — обрыв посреди слова читается как поломка.
 */
export function metaDescription(text: string, max: number = META_DESCRIPTION_MAX): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;

  // Место для многоточия: иначе строка вылезает за лимит ровно на один символ.
  const cut = flat.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");

  // Слово длиннее лимита целиком — резать по границе слова нечего.
  const trimmed = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.!?-]+$/, "");

  return `${trimmed}…`;
}
