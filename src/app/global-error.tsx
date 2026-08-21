"use client";

import "./globals.css";

/**
 * Запасной экран для ошибок в самом корневом layout.
 *
 * `error.tsx` не оборачивает layout своего сегмента — если падает корневой,
 * ловить сбой больше нечему, и пользователь видит пустую страницу браузера.
 * Поэтому этот файл заменяет layout целиком и обязан объявить собственные
 * `<html>` и `<body>`.
 *
 * Зависимостей здесь намеренно минимум: только глобальные стили ради палитры.
 * Шрифт `next/font` не подключается — это последний рубеж, и он не должен
 * падать из-за того же, из-за чего упал layout. Системный шрифт достаточно.
 *
 * `metadata` в этом файле не поддерживается (граница ошибок — клиентский
 * компонент), поэтому заголовок вкладки ставится тегом.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="ru">
      <body className="font-sans">
        <title>Ошибка — Sferus</title>

        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center text-foreground">
          <p className="select-none text-7xl font-bold tracking-tighter text-muted-foreground/30">
            500
          </p>

          <h1 className="mt-4 text-2xl font-medium tracking-tight">Сайт временно недоступен</h1>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Мы уже знаем о сбое и разбираемся. Попробуйте обновить страницу через минуту.
          </p>

          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-8 cursor-pointer rounded-lg border border-input px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
          >
            Попробовать снова
          </button>

          {error.digest && (
            <p className="mt-6 text-xs text-muted-foreground/70">
              Код ошибки: <code className="font-mono">{error.digest}</code>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
