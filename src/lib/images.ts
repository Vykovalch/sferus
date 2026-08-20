/**
 * Ограничения и помощники загрузки изображений — общие для сервера и клиента.
 *
 * Вынесены отдельно от `lib/storage.ts` намеренно: тот помечен `server-only`,
 * потому что тянет SDK хранилища, а лимиты и проверка адреса нужны и схеме
 * валидации, и форме в браузере. Тот же приём, что у пары
 * `action-state.ts` / `action-client.ts` — ARCHITECTURE.md, раздел 5.1.
 */

export const IMAGE_UPLOAD = {
  /** Столько фотографий разрешает форма объявления. */
  maxFiles: 5,
  /** Предел на исходный файл до сжатия. */
  maxBytes: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  /** Длинная сторона после сжатия. */
  maxDimension: 1600,
  /** Сторона квадратного аватара. */
  avatarDimension: 512,
  quality: 0.82,
} as const;

/** Хост публичного хранилища Vercel Blob: `<store>.public.blob.vercel-storage.com`. */
const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/**
 * Адрес получен из нашего хранилища?
 *
 * Проверка обязательна в схеме объявления: адреса приходят из формы, то есть
 * их подставляет пользователь. Без неё в объявление можно было бы вписать
 * любую чужую картинку — вплоть до отслеживающего пикселя на стороннем домене.
 */
export function isUploadedImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

function toWebpName(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "");
  return `${base || "photo"}.webp`;
}

/**
 * Сжатие в браузере перед загрузкой.
 *
 * Фото с телефона весит 3–8 МБ, а карточке каталога хватает 1600px по длинной
 * стороне — это разница в разы и по объёму хранилища, и по скорости открытия
 * каталога.
 *
 * Побочный эффект, ради которого это стоило бы делать и без экономии:
 * пересжатие **срезает EXIF**, а вместе с ним геометку съёмки. Для площадки,
 * где люди фотографируют работу дома, публикация координат была бы утечкой.
 *
 * Если браузер не смог обработать файл, возвращаем исходный: лучше загрузить
 * тяжёлое фото, чем потерять его совсем.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, IMAGE_UPLOAD.maxDimension / Math.max(bitmap.width, bitmap.height));

    return await drawToWebp(bitmap, {
      fileName: file.name,
      width: Math.round(bitmap.width * scale),
      height: Math.round(bitmap.height * scale),
    });
  } catch {
    return file;
  }
}

/**
 * Аватар: квадрат со стороной 512, обрезанный по центру.
 *
 * Обрезаем здесь, а не растягиваем в CSS: аватар показывается в круге в шапке,
 * в меню и на профиле, и вписывать в него прямоугольник каждый раз заново —
 * значит получать разный результат в разных местах.
 */
export async function compressAvatar(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const side = Math.min(bitmap.width, bitmap.height);

    return await drawToWebp(bitmap, {
      fileName: file.name,
      width: IMAGE_UPLOAD.avatarDimension,
      height: IMAGE_UPLOAD.avatarDimension,
      source: {
        x: Math.round((bitmap.width - side) / 2),
        y: Math.round((bitmap.height - side) / 2),
        width: side,
        height: side,
      },
    });
  } catch {
    return file;
  }
}

interface DrawOptions {
  fileName: string;
  width: number;
  height: number;
  /** Область исходника, если нужна обрезка. По умолчанию берётся целиком. */
  source?: { x: number; y: number; width: number; height: number };
}

async function drawToWebp(bitmap: ImageBitmap, options: DrawOptions): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas недоступен");

  const source = options.source ?? { x: 0, y: 0, width: bitmap.width, height: bitmap.height };
  context.drawImage(
    bitmap,
    source.x,
    source.y,
    source.width,
    source.height,
    0,
    0,
    options.width,
    options.height,
  );
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", IMAGE_UPLOAD.quality);
  });

  if (!blob) throw new Error("не удалось закодировать изображение");

  return new File([blob], toWebpName(options.fileName), { type: "image/webp" });
}
