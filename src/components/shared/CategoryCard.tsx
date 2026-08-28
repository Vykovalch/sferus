import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: LucideIcon;
  /** Число объявлений в категории. Появится на этапе 1 вместе с реальными услугами. */
  count?: number;
  iconColor?: string;
}

export function CategoryCard({
  name,
  slug,
  icon: Icon,
  count,
  iconColor = "text-brand",
}: CategoryCardProps) {
  return (
    <Link
      href={`/services/${slug}`}
      className="group flex flex-col items-start text-left p-6 h-full bg-card border border-border rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Иконка без подложки: цветной квадрат перетягивал внимание с названия
          и добавлял вложенную рамку внутрь карточки. Размер увеличен с 28 до
          36px — линейной иконке нужен вес, который раньше давала подложка.
          Высота фиксированная, поэтому заголовки всех карточек по-прежнему
          начинаются на одном уровне. */}
      <Icon
        className={`h-9 w-9 mb-4 ${iconColor} transition-transform duration-200 group-hover:scale-110`}
      />

      <h3 className="text-base font-medium text-foreground leading-snug">{name}</h3>

      {/* Счётчик прижат к низу — в ряду совпадают и левые края, и нижняя строка.
          pt-2 держит минимальный зазор, когда название заняло две строки
          и свободного места под него не осталось. */}
      {count !== undefined && (
        <p className="text-sm text-muted-foreground mt-auto pt-2">{count} объявлений</p>
      )}
    </Link>
  );
}
