import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Нативный `<select>` в оформлении поля ввода.
 *
 * Собственный компонент, а не `Select` из shadcn: тот строит выпадающий список
 * на radix со слоем поверх страницы. Ради двух справочников — категорий
 * и городов — это лишнее, а на телефоне нативный список ещё и удобнее:
 * системный барабан вместо страницы с прокруткой.
 *
 * Классы повторяют `ui/input.tsx`: тот же радиус 8px, тот же прозрачный фон,
 * та же подсветка фокуса и ошибки. Без общего места они расходились —
 * до 2026-09-30 селекты в формах размещения были скруглены на 6px, залиты
 * `--background` (на белой карточке выходили серыми рядом с белыми полями),
 * носили тень, которой нет ни у одного поля на сайте, и не показывали ошибку:
 * `aria-invalid` на них стоял, но ничего не рисовал.
 */
export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "h-10 w-full min-w-0 cursor-pointer rounded-lg border border-input bg-transparent px-3 py-1 text-base outline-none transition-colors focus-visible:border-state/60 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}
