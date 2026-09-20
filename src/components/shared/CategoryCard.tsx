import Link from "next/link";
import { categoryIcon } from "@/lib/category-icons";
import { formatListingCount } from "@/lib/format";

interface CategoryCardProps {
  name: string;
  slug: string;
  /** Число опубликованных объявлений в категории. Не передано — строки со счётчиком нет. */
  count?: number;
}

export function CategoryCard({ name, slug, count }: CategoryCardProps) {
  // Иконку карточка берёт сама: она однозначно выводится из слага, и передавать
  // её пропом значило бы повторять этот вызов в каждом месте использования.
  const Icon = categoryIcon(slug);

  return (
    // Фон белый, как у всех карточек сайта (решение владельца, 2026-09-18).
    // С 2026-09-16 был градиент цвета категории книзу — 20 разных цветов
    // делали сетку пёстрой.
    //
    // p-4 до 640px: на 375px карточка шириной 165px, и отступы по 24px
    // оставляли названию 117px — «Строительство и ремонт» ложилось в три строки.
    <Link
      href={`/services/${slug}`}
      className="group flex flex-col items-start text-left p-4 sm:p-6 h-full bg-card border border-border rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Иконка без подложки: цветной квадрат перетягивал внимание с названия
          и добавлял вложенную рамку внутрь карточки. Размер 36px — линейной
          иконке нужен вес, который раньше давала подложка. Высота
          фиксированная, поэтому заголовки всех карточек начинаются на одном
          уровне.

          Двухтоновый стиль: тёмный контур и фирменная жёлтая заливка
          (`icon-duotone` в globals.css) — один стиль на все категории вместо
          прежних 20 цветов из палитры Tailwind. */}
      <Icon
        weight="duotone"
        aria-hidden="true"
        className="icon-duotone h-9 w-9 mb-4 text-foreground transition-transform duration-200 group-hover:scale-110"
      />

      <h3 className="text-base font-medium text-foreground leading-snug">{name}</h3>

      {/* Счётчик прижат к низу — в ряду совпадают и левые края, и нижняя строка.
          pt-2 держит минимальный зазор, когда название заняло две строки
          и свободного места под него не осталось. */}
      {count !== undefined && (
        <p className="text-sm text-muted-foreground mt-auto pt-2">{formatListingCount(count)}</p>
      )}
    </Link>
  );
}
