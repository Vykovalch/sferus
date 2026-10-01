import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Страница 404.
 *
 * `div`, а не `main`: обёртку `main` даёт корневой layout, и второй
 * внутри первого ломал бы структуру документа.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center bg-background text-foreground animate-in fade-in duration-300">
      {/* Код ошибки — украшение: то же самое сказано заголовком ниже словами,
          поэтому скринридеру он не нужен. Контраст 1.4:1 нормам не отвечает
          и не обязан: для декоративной графики их нет. */}
      <p
        aria-hidden="true"
        className="text-7xl font-bold tracking-tighter text-muted-foreground/30 select-none"
      >
        404
      </p>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Страница не найдена</h1>

      <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-sm leading-relaxed">
        Возможно, эта страница была удалена, перемещена или вы ошиблись при вводе адреса.
      </p>

      <Button
        variant="outline"
        asChild
        className="mt-8 h-10 rounded-full px-5 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground text-base font-medium cursor-pointer transition-colors"
      >
        <Link href="/">
          <Home className="h-4 w-4" />
          На главную
        </Link>
      </Button>
    </div>
  );
}
