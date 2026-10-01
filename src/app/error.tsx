"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  /**
   * `unstable_retry`, а не `reset`.
   *
   * `reset` только очищает состояние границы и перерисовывает **без повторного
   * запроса** — от ошибки в серверном компоненте он не спасает. Здесь все
   * страницы серверные и читают из базы, поэтому при самом вероятном сбое
   * (отвалилась база) кнопка с `reset` выглядела бы рабочей и не делала ничего.
   * `unstable_retry` перезапрашивает данные и перерисовывает заново.
   */
  unstable_retry: () => void;
}

/**
 * Страница 500.
 *
 * `div`, а не `main`: обёртку `main` даёт корневой layout.
 */
export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center bg-background text-foreground animate-in fade-in duration-300">
      {/* Код ошибки — украшение: то же самое сказано заголовком ниже словами,
          поэтому скринридеру он не нужен. */}
      <p
        aria-hidden="true"
        className="text-7xl font-bold tracking-tighter text-muted-foreground/30 select-none"
      >
        500
      </p>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Что-то пошло не так</h1>

      <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-sm leading-relaxed">
        Внутренняя ошибка сервера. Не беспокойтесь, мы уже в курсе и чиним её. Попробуйте обновить
        страницу.
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={() => unstable_retry()}
        className="mt-8 h-10 rounded-full px-5 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground text-base font-medium cursor-pointer transition-colors"
      >
        {/* `group-hover/button:`, а не `group-hover:` — у кнопки кита группа
            именованная (`group/button`), и безымянный вариант не совпадал
            с ней: поворот значка не работал вовсе. */}
        <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover/button:rotate-180" />
        Попробовать снова
      </Button>

      {/* Код ошибки — единственное, что связывает увиденное человеком с записью
          в серверном логе. Текст самой ошибки Next наружу не отдаёт сознательно,
          поэтому без этого кода обращение в поддержку нечем сопоставить.

          Цвет без прозрачности: `--muted-foreground` на 70% — это #888 на белом,
          3.5:1 при норме 4.5 для мелкого текста. */}
      {error.digest && (
        <p className="mt-6 text-xs text-muted-foreground">
          Код ошибки: <code className="font-mono">{error.digest}</code>
        </p>
      )}
    </div>
  );
}
