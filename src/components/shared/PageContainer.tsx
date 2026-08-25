import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Единая ширина страницы — 1280px (`max-w-7xl` — Tailwind уже даёт это
 * значение из коробки, отдельный токен под то же число не нужен).
 *
 * Не использует утилиту Tailwind `container`: у неё ступенчатое поведение
 * по брейкпоинтам (на 900px, например, она даёт max-width: 768px, а не
 * «почти всю доступную ширину») — на промежуточных viewport это оставляло
 * лишние пустые поля, не связанные с реальной шириной экрана. Здесь вместо
 * этого простой fluid-контейнер с одним потолком.
 */
export function PageContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)} {...props} />
  );
}
