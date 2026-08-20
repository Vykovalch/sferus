import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { auth } from "@/lib/auth";
import { IMAGE_UPLOAD } from "@/lib/images";

/**
 * Выдача одноразового токена на загрузку файла.
 *
 * Route Handler, а не Server Action, и это единственное место в проекте, где
 * мутация идёт не через `authedAction`. Причина техническая: механизм прямой
 * загрузки обменивается токеном по обычному HTTP и сам вызывает этот адрес.
 * Доменных данных здесь не меняется — файл просто попадает в хранилище,
 * а к объявлению его привязывает Server Action формы, проверяя права.
 *
 * **Проверка сессии обязательна.** Без неё эндпоинт превращается в открытый
 * файлообменник: токен позволяет писать в наш store кому угодно.
 *
 * Ограничения типа и размера ставятся здесь, а не только в браузере: клиентские
 * проверки обходятся, серверные — нет.
 */
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) throw new Error("Требуется вход в аккаунт");

        return {
          allowedContentTypes: [...IMAGE_UPLOAD.allowedTypes],
          maximumSizeInBytes: IMAGE_UPLOAD.maxBytes,
          // Случайный суффикс в имени: иначе два пользователя с «photo.jpg»
          // перезапишут файлы друг друга.
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: session.user.id }),
        };
      },
      onUploadCompleted: async () => {
        // Намеренно пусто. Строку в `service_images` пишет Server Action формы:
        // фотография принадлежит объявлению с момента сохранения, а не с момента
        // загрузки файла. Плюс этот колбэк не срабатывает на localhost — Blob
        // не может достучаться до машины разработчика.
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
