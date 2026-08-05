import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Плейсхолдер для данных, которые невозможно заполнить из кода:
 * реквизиты владельца платформы, юрисдикция и т.п.
 * Намеренно выделен визуально — чтобы незаполненное поле нельзя было
 * случайно опубликовать, не заметив.
 */
export function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-amber-200/70 dark:bg-amber-500/25 text-foreground px-1 py-0.5 rounded font-medium not-italic">
      [{children}]
    </mark>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-5">
      <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li
          // biome-ignore lint/suspicious/noArrayIndexKey: static legal copy
          key={i}
          className="flex gap-2"
        >
          <span className="text-brand flex-shrink-0 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalDoc({
  title,
  updatedAt,
  intro,
  children,
}: {
  title: string;
  updatedAt: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
          >
            <Link
              href="/"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Главная
            </Link>
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60"
            />
            <span aria-current="page" className="text-foreground font-medium">
              {title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-background border border-border rounded-xl p-5 md:p-8 shadow-sm">
          <h1 className="text-xl md:text-2xl font-medium text-foreground tracking-tight mb-1">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground mb-6">Редакция от {updatedAt}</p>

          {intro && (
            <div className="text-sm text-muted-foreground leading-relaxed mb-6 space-y-3">
              {intro}
            </div>
          )}

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
