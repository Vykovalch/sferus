import Link from "next/link";

/**
 * Группа фильтра как список ссылок, а не радио-кнопок в форме.
 *
 * Каждый вариант — самостоятельный URL каталога, поэтому семантически это
 * навигация, а не ввод формы: клик сразу переносит на отфильтрованную
 * страницу. Ссылки работают без JS на клиенте и переживают `next/link`
 * prefetch бесплатно — не нужен ни `"use client"`, ни ручная синхронизация
 * состояния с адресной строкой.
 */
interface FilterOption {
  label: string;
  href: string;
  active: boolean;
}

interface FilterLinkGroupProps {
  title: string;
  options: FilterOption[];
}

export function FilterLinkGroup({ title, options }: FilterLinkGroupProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="py-1">
        {options.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            scroll={false}
            aria-current={option.active ? "true" : undefined}
            className={`block px-4 py-2 text-sm leading-snug transition-colors hover:bg-muted/40 ${
              option.active
                ? "text-brand font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
