import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Отступление от умолчания shadcn: убран `md:text-sm` (решение владельца,
 * 2026-09-28). В ките поле уменьшается до 14px от 768px — это соглашение
 * плотных рабочих интерфейсов, откуда кит и происходит (GitHub, Linear,
 * админки). Sferus — витрина: формы заполняют редко, часто впервые,
 * и плотность там не достоинство.
 *
 * Два довода из нашего же кода: подписи полей 14px, и при поле 14px введённое
 * значение равнялось служебной подписи над ним; базовый текст сайта 16px,
 * поле на 14 выпадало из шкалы.
 *
 * Замер 999.md (2026-09-28): `body` 18px, плейсхолдер поля 16px на всех
 * ширинах, а в медиазапросе до 768px полю явно задано 16px. Ниже 16 они
 * не опускаются нигде. У Профи.ру шкала текста 17 / 15 / 13 — значения 14
 * в ней нет вовсе.
 *
 * 16px на телефоне трогать нельзя в любом случае: Safari приближает страницу
 * при фокусе в поле с меньшим кеглем.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-state/60 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
