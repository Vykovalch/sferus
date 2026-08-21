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

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  return (
    // Изменено: Используем безопасный центрированный контейнер, который отлично встанет внутрь main.flex-1
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center bg-background text-foreground animate-in fade-in duration-300">
      {/* Большой системный код ошибки */}
      <p className="text-7xl font-bold tracking-tighter text-muted-foreground/30 select-none">
        500
      </p>

      {/* Заголовок */}
      <h1 className="mt-4 text-2xl font-medium tracking-tight">Что-то пошло не так</h1>

      {/* Описание */}
      <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
        Внутренняя ошибка сервера. Не беспокойтесь, мы уже в курсе и чиним её. Попробуйте обновить
        страницу.
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={() => unstable_retry()}
        className="mt-8 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer shadow-sm transition-all"
      >
        <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
        Попробовать снова
      </Button>

      {/* Код ошибки — единственное, что связывает увиденное человеком с записью
          в серверном логе. Текст самой ошибки Next наружу не отдаёт сознательно,
          поэтому без этого кода обращение в поддержку нечем сопоставить. */}
      {error.digest && (
        <p className="mt-6 text-xs text-muted-foreground/70">
          Код ошибки: <code className="font-mono">{error.digest}</code>
        </p>
      )}
    </div>
  );
}
