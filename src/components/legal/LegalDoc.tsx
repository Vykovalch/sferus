import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";

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

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-5">
      {/* 16px `semibold` — принятая ступень заголовка блока (2026-10-01).
          Было 14px, то есть ровно как текст под ним. */}
      <h2 className="text-base font-semibold text-foreground mb-3">{title}</h2>
      {/* Текст документа — 16px основным цветом, а не 14px серым: это главное
          содержимое страницы, а `--muted-foreground` остаётся второстепенному.
          Заодно длина строки приходит в норму: в контейнере `max-w-3xl`
          при 14px в строку влезало около 90 знаков, при 16px — около 80,
          то есть верхняя граница удобного чтения, а не за ней. */}
      <div className="space-y-3 text-base text-foreground leading-relaxed">{children}</div>
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
      <PageContainer className="py-6 lg:py-8 max-w-3xl">
        {/* Хлебные крошки — в том же контейнере, что заголовок и содержимое
            (2026-10-01; на остальных страницах так с 2026-09-29). До этого они
            лежали в отдельной обёртке с собственным `py-3` и фоном
            `bg-background`, совпадавшим с фоном страницы: обёртка ничего
            не давала, а её нижний отступ складывался с верхним отступом
            содержимого. Это было последнее такое место в проекте. */}
        <div className="mb-3">
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

        {/* Панель по общему рецепту (`bg-card`, рамка, скругление 16px,
            без тени), но с внутренним отступом 20 / 32 вместо 20 / 24:
            это поверхность для чтения, а не карточка формы, и на широком
            экране документу нужны поля шире. */}
        <div className="bg-card border border-border rounded-2xl p-5 md:p-8">
          {/* Кегль не адаптивный: это ярлык страницы, а не имя объекта
              (DESIGN.md, «Заголовок внутренней страницы»). */}
          <h1 className="text-2xl font-semibold tracking-tight mb-1">{title}</h1>
          <p className="text-sm text-muted-foreground mb-6">Редакция от {updatedAt}</p>

          {intro && (
            <div className="text-base text-foreground leading-relaxed mb-6 space-y-3">{intro}</div>
          )}

          <div className="space-y-6">{children}</div>
        </div>
      </PageContainer>
    </div>
  );
}
